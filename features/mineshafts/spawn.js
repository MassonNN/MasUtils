import Settings from '../../settings'
import { 
    executeCommand, getScoreboard, addWaypoint, addTrace, 
    removeWaypoints, removeTraces, sendModMessage, sendErrorMessage
} from '../../utils';
import { ERRORS } from '../error';
import { getCorpsesCount, verifyCorpses, isCorpseTABLoaded, scanCorpses } from './corpse';

let detectTypeTries = 0;
const MINESHAFT_TYPES = Object.freeze({
    TOPA1: "TOPAZ (without Crystal)",
    TOPA2: "TOPAZ (with Crystal)",
    SAPP1: "SAPPHIRE (without Crystal)",
    SAPP2: "SAPPHIRE (with Crystal)",
    AMET1: "AMETHYST (without Crystal)",
    AMET2: "AMETHYST (with Crystal)",
    AMBE1: "AMBER (without Crystal)",
    AMBE2: "AMBER (with Crystal)",
    JADE1: "JADE (without Crystal)",
    JADE2: "JADE (with Crystal)",
    AMET1: "AMETHYST (without Crystal)",
    TITA1: "TITANIUM",
    UMBE1: "UMBER",
    TUNG1: "TUNGSTEN",
    FAIR1: "FAIRY (Vanguard)",
    JASP1: "JASPER (without Crystal)",
    JASP2: "JASPER (with Crystal)",
    OPAL1: "OPAL (without Crystal)",
    OPAL2: "OPAL (with Crystal)",
    RUBY1: "RUBY (without Crystal)",
    RUBY2: "RUBY (with Crystal)",
    ONYX1: "ONYX (without Crystal)",
    ONYX2: "ONYX (with Crystal)",
    AQUA1: "AQUAMARINE (without Crystal)",
    AQUA2: "AQUAMARINE (with Crystal)",
    CITR2: "CITRINE (with Crystal)",
    CITR1: "CITRINE (without Crystal)",
    UNDEF: "Undefined (cannot find this type)"
});

let loadingMineshaft = false;
let mineshaftFound = false;

register('chat', () => {
    if (Settings.debug)
        console.log(`Entered mineshaft`);
    loadingMineshaft = true;
}).setChatCriteria("&r&aSending to Mineshaft...&r")


let deduplicateLoadingMineshaft = false;
register('worldLoad', () => {
    if (deduplicateLoadingMineshaft) return;
    if (loadingMineshaft) {
        deduplicateLoadingMineshaft = true;
        setTimeout(afterLoadMineshaft, 2000);
    }
})

register('postRenderEntity', (entity, pos, partialTicks) => {
    let name = entity.getName();
    if (name.includes("Mineshaft") && name.includes(Player.getName()) && mineshaftFound == false) {
        if (Settings.mineshaftWaypoint) {
            let x = entity.getX();
            let y = entity.getY();
            let z = entity.getZ();
            
            addWaypoint("Mineshaft", x, y, z);
            addTrace(x, y, z);
        }
        
        mineshaftFound = true;
        if (Settings.autoWarpMineshaft && Settings.mineshaftParty)
            executeCommand(`pc ${Settings.messageOnMineshaftSpawned}`)
    }
})

function afterLoadMineshaft() {
    if (mineshaftFound == false) return;
    loadingMineshaft = false;
    deduplicateLoadingMineshaft = false;
    let type = detectMineshaftType();
    if (type == MINESHAFT_TYPES.UNDEF) {
        if (detectTypeTries > 3) {
            detectTypeTries = 0;
            return MINESHAFT_TYPES.UNDEF;
        }
        detectTypeTries += 1;
        setTimeout(afterLoadMineshaft, 2000 + Server.getPing()*detectTypeTries);
        return;
    }
    let name = Player.getName();
    if (Settings.debug)
        console.log(`Loaded Mineshaft of type ${type} by ${name}`)
    mineshaftSpawned(name, type);
    if (Settings.mineshaftParty) 
        ChatLib.command("pc " +  `Spawned mineshaft of type ${type}`);
    removeWaypoints();
    removeTraces();
    mineshaftFound = false;
    detectTypeTries = 0;

    if (Settings.corpseFinder) {
        corpseFinder()
    }
    if (Settings.mineshaftHinter) {
        sendMineshaftHint(type)
    }
}

let corpseFinderTries = 0;
function corpseFinder () {
    if (isCorpseTABLoaded()) {
        scanCorpses()
        corpseFinderTries = 0;
        return;
    } else {
        if (corpseFinderTries > 3) {
            corpseFinderTries = 0;
            sendErrorMessage(ERRORS.CORPSE_WIDGET_MISSING);
            return;
        } else {
            corpseFinderTries++;
            setTimeout(corpseFinder, (2000 + Server.getPing())*corpseFinderTries)
            return;
        }
    }
    
}

export function mineshaftSpawned(name, type) {
    if (Settings.debug) {
        console.log(`Mineshaft spawned by ${name} of type ${type}`);
    }
    if (Player.getName() != name && Settings.mineshaftParty)
        Client.showTitle("&a&lMineshaft!", `&aby ${name}`);
    else {
        if (Settings.autoWarpMineshaft && Settings.mineshaftParty)
            executeCommand("p warp")
        return;
    }
    if (Settings.autoTransferPartyOnMineshaft && Settings.mineshaftParty)
        if (Player.getName() != name)
            executeCommand("p transfer " + name)
}

export function detectMineshaftType() {
    let lines = getScoreboard();
    let server_line = lines[lines.length-1];
    if (server_line == undefined || server_line.length == 0)
        return MINESHAFT_TYPES.UNDEF;
    let shafttype = MINESHAFT_TYPES.UNDEF
    Object.keys(MINESHAFT_TYPES).forEach(type => {
        if (server_line.includes(type.toString())) {
            shafttype = MINESHAFT_TYPES[type];
        }
    });
    return shafttype;
}

let hintTries = 0;
function sendMineshaftHint(type) {
    let corpsesCount = getCorpsesCount();
    if (corpsesCount == 0) {
        if (hintTries > 3) {
            hintTries = 0;
            sendErrorMessage(ERRORS.CORPSES_HAVENT_FOUND)
            return;
        }
        hintTries++;
        setTimeout(() => {sendMineshaftHint(type)}, (2000+Server.getPing())*hintTries)
        return;
    }
    // var profit = 0;
    sendModMessage(`You have entered mineshaft of type &3${type}&r!`)
    sendModMessage(`It contains &3${corpsesCount}&r corpse(s).`)
    // sendModMessage(`You can mine this for &3${profit}$&r!`)
}

register('step', () => {
    if (detectMineshaftType() != MINESHAFT_TYPES.UNDEF && Settings.corpseFinder) {
        if (verifyCorpses() == false) {
            removeWaypoints()
            scanCorpses()
        }
    }
}).setDelay(2)