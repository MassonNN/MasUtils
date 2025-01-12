import Settings from './settings'
import { ERRORS } from './features/error'

export function getplayername(player) {
    let num
    let name
    num = player.indexOf(']')
    if (num == -1) {                // This part is only  ***When I wrote this, god and I knew how it worked, now only he knows.***
        num = player.indexOf('&7')  // for nons because
        if (num == -1) {            // it doesnt work
            num = -2                // without that
        }                           // #BanNons
    }
    name = player.substring(num+2).removeFormatting()
    name = name.replaceAll(/[^a-zA-Z0-9_]/g, '').replaceAll(' ', '').trim()
    return name
}

const baseCooldownBetweenCommands = 100;
var commandQueue = [];
var lastExecuted = 0;
export var waypoints = [];
export var traces = [];

export function executeCommand(command) {
    if (Settings.debug)
        console.log(`Queued command: ${command}`)
    commandQueue.push(command)
}

register('step', (elapsed) => {
    let now = Date.now()

    if (commandQueue.length > 0 && now > lastExecuted + baseCooldownBetweenCommands) {
        cmd = commandQueue.shift();
        if (cmd == undefined)
            return;
        ChatLib.command(cmd);
        lastExecuted = now;
        if (Settings.debug)
            console.log(`Executed command ${cmd} with elapsed ${elapsed} frames`)
    }
}).setFps(2)

export const getScoreboard = (formatted=false) => {
    // if (!World.getWorld()) return null
    let sb = Scoreboard.getLines().map(a => a.getName())
    if (formatted) return Scoreboard.getLines()
    return sb.map(a => ChatLib.removeFormatting(a))
}

class NamedWaypoint {
    x;
    y;
    z;
    text;
    id;

    constructor(text, x, y, z, id=undefined) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.text = text;
        this.id = id
    }
}

class Trace {
    x;
    y;
    z;
    id;

    constructor(x, y, z, id=undefined) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.id = id;
    }
}

export function addWaypoint(text, x, y, z, id=undefined) {
    waypoints.push(new NamedWaypoint(text, x, y, z));
}

export function removeWaypoints() {
    while(waypoints.length > 0)
        waypoints.shift();
}

export function removeWaypoint(id) {
    waypoints.forEach(waypoint => {
        if (waypoint.id == id) {
            waypoints.slice(waypoints.indexOf(waypoint), 1)
        }
    })
}

export function addTrace(x, y, z, id=undefined) {
    traces.push(new Trace(x, y, z, id));
}

export function removeTraces() {
    while(traces.length > 0)
        traces.shift();
}

export function removeTrace(id) {
    traces.forEach(d_trace => {
        if (d_trace.id == id) {
            traces.slice(traces.indexOf(d_trace), 1)
        }
    })
}

export function sendModMessage(text) {
    ChatLib.chat(
        new Message(
            new TextComponent("&3&l[MasUtils]&r ")
            .setClick("run_command", "/mu")
            .setHover("show_text", "&3Click to open settings"),
            new TextComponent(text)
        )
    )
}

/**
 * 
 * @param {ERRORS} error 
 */
export function sendErrorMessage(error) {
    ChatLib.chat(
        new Message(
            new TextComponent("&3&l[MasUtils] &c[ERROR]&r " + error[0])
            .setHover("show_text", error[1])
        )
    )
}