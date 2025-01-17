import { addWaypoint, removeTraces, removeWaypoints, sendModMessage } from "../../utils";
import { Counter  } from "../../lovejs";

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");

export const CorpseType = Object.freeze({
  LAPIS: "Lapis",
  UMBER: "Umber",
  TUNGSTEN: "Tungsten", 
  VANGUARD: "Vanguard",
  UNDEFINED: "Undefined"
});

let curCorpses = new Counter();

export class Corpse {
    type;
    x;
    y;
    z;
    uuid;

    constructor(type, x=undefined, y=undefined, z=undefined, uuid=undefined) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;
        this.uuid = uuid;
    }
}

export function isCorpseTABLoaded() {
    let loaded = false;
    TabList.getNames().forEach(line => {
        if (line.removeFormatting().toString().toLowerCase().includes("frozen corpses")) {
            loaded = true;
        }
    })
    return loaded;
}

export function getCorpsesFromTAB() {
    let counter = new Counter();

    TabList.getNames().forEach(line => {
        Object.keys(CorpseType).forEach(type => {
            if (line.removeFormatting().toLowerCase().includes(type.toString().toLowerCase())) {
                counter.increase(type);
            }
                
        })
    })

    return counter;    
}

// From ColeWeight (fixed)
export function scanCorpses() {
    curCorpses.clear()
    const entities = World.getAllEntitiesOfType(EntityArmorStand.class).filter(a => a?.getName() == "Armour Stand" && !a.isInvisible())
    entities.forEach(entity => {
        let helmetName = new EntityLivingBase(entity.getEntity()).getItemInSlot(4)?.getName()?.removeFormatting()?.toString()
        let corpseType;
        switch (helmetName) {
            case "Lapis Armor Helmet":
                corpseType = CorpseType.LAPIS;
                break
            case "Mineral Helmet":
                corpseType = CorpseType.TUNGSTEN
                break
            case "Yog Helmet":
                corpseType = CorpseType.UMBER
                break
            case "Vanguard Helmet":
                corpseType = CorpseType.VANGUARD
                break
            default:
                corpseType = CorpseType.UNDEFINED
                break
        }
        curCorpses.increase(corpseType)
        addWaypoint(`Possible corpse: ${corpseType}`, entity.getX(), entity.getY(), entity.getZ(), entity.getUUID())
    })
}

export function getDiffCorpses() {
    var fromTAB = getCorpsesFromTAB()
    return curCorpses.diff(fromTAB);
}

export function verifyCorpses() {
    let isVerified = true;
    getDiffCorpses().forEach((count, _type) => {
        if (count > 0) isVerified = false;
    })
    return isVerified;
}

export function getCorpsesCount() {
    var count = 0;
    curCorpses.forEach((value, _type) => {
        count += value;
    })
    return count;
}

export function getCorpsesCountFromTAB() {
    var count = 0;
    getCorpsesFromTAB().forEach((value, _type) => {
        count += value;
    })
    return count;
}

register('worldLoad', () => {
    removeWaypoints()
    removeTraces()
})