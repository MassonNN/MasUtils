import { executeCommand, getplayername, sendModMessage } from '../../utils';
import { mineshaftSpawned } from './spawn'
import Settings from '../../settings'

const S03_PACKET_TIME_UPDATE = Java.type(
    "net.minecraft.network.play.server.S03PacketTimeUpdate"
);
const C16PacketClientStatus = Java.type(
    "net.minecraft.network.play.client.C16PacketClientStatus"
);
const S37PacketStatistics = Java.type(
    "net.minecraft.network.play.server.S37PacketStatistics"
);
const S01PacketJoinGame = Java.type(
    "net.minecraft.network.play.server.S01PacketJoinGame"
);
const System = Java.type("java.lang.System");

let requestedTPS = false;
let requestedPing = false;
let lastPing = null;
let lastPingAt = null;
let prevTime = null;
let noWarp = [];

register("chat", (player, message) => {
    if (Settings.partyCommands == false) return;
    message = message.split(" ");
    let playername = getplayername(player)
    switch (message[0].toLowerCase()) {
        case "!w":
        case "!warp":
            kickToNoWarp()
            break;
        case "!ptme":
        case "!pt":
        case "!transfer":
            executeCommand(`p transfer ${playername}`)
            break;
        case "!tps":
            requestedTPS = true;
            executeCommand(`pc [MasUtils] Waiting for TPS check...`)
            break;
        case "!ping":
            executeCommand(`pc [MasUtils] PING: ${~~lastPing}`)
            break;
        case "!fps":
            executeCommand(`pc [MasUtils] FPS: ${Client.getFps()}`)
            break;
        case "!nowarp":
        case "!nwp":
            executeCommand(`pc [MasUtils] Stop warping ${playername}`)
            noWarp.push(playername)
            break;
        case "!conwarp":
        case "!cwp":
            executeCommand(`pc [MasUtils] Continue warping ${playername}`)
            noWarp.splice(noWarp.indexOf(playername), 1)
            break;
        case "!keys":
            let tungsten = 0;
            let umber = 0;
            let vanguard = 0;
            Player.getInventory().getItems().forEach(item => {
                if (item.getName().removeFormatting().toLowerCase().includes("tungsten"))
                    tungsten += item.getStackSize()
                if (item.getName().removeFormatting().toLowerCase().includes("umber"))
                    umber += item.getStackSize()
                if (item.getName().removeFormatting().toLowerCase().includes("vanguard"))
                    vanguard += item.getStackSize()
            })
            executeCommand(`pc [MasUtils] Tungsten: ${tungsten} | Umber: ${umber} | Vanguard: ${vanguard}`)
            break;

  }
}).setCriteria("&r&9Party &8> ${player}&f: &r${message}&r");

register('chat', (player, type) => {
    mineshaftSpawned(getplayername(player), type);
}).setCriteria("&r&9Party &8> ${player}&f: &rSpawned mineshaft of type {type}&r");

register("packetReceived", (packet) => {
    if (packet instanceof S03_PACKET_TIME_UPDATE && requestedTPS) {
      if (prevTime !== null) {
        let time = Date.now() - prevTime;
        let instantTps = MathLib.clampFloat(20000 / time, 0, 20);
        executeCommand(`pc [MasUtils] TPS: ${parseFloat(instantTps).toFixed(1)}`);
        requestedTPS = false;
      }
      prevTime = Date.now();
    }
  });


function checkPing() {
    if (!requestedPing) {
        Client.sendPacket(new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS))
        lastPingAt = System.nanoTime()
        requestedPing = true
    }
}

register('step', () => {
    checkPing()
}).setDelay(2)

register('packetReceived', () => {
	if (lastPingAt > 0) {
		let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000)
		lastPingAt *= -1
		lastPing = diff
		requestedPing = false
	}
}).setFilteredClass(S37PacketStatistics)

register('packetReceived', () => {
	if (lastPingAt > 0) {
		lastPingAt = -1
		requestedPing = false
	}
}).setFilteredClass(S01PacketJoinGame)

register("command", () => {
    sendModMessage(`PING: ${~~lastPing}`)
}).setName("muping")

function kickToNoWarp () {
    noWarp.forEach(playername => {
        executeCommand(`p kick ${playername}`)
    })
    setTimeout(excludeWarp, 100)
}

function excludeWarp () {
    executeCommand(`p warp`)
    setTimeout(reInviteAfterWarp, 100)
}

function reInviteAfterWarp () {
    noWarp.forEach(playername => {
        executeCommand(`p invite ${playername}`)
    })
}
