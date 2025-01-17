import { adaptLootString, foundCorpse } from "../../persistent/corpseStats"
import { CorpseType } from "./corpse"
import { data } from "../../index"
import { sendModMessage } from "../../utils";

let waitingForLoot = undefined;
let loots = [];
const DIVIDER = /.*[▬]{3,}.*/g

register("chat", (type) => {
    waitingForLoot = CorpseType[type];
    console.log("Started loot handling");
}).setChatCriteria("  ${type} CORPSE LOOT! ")

register("chat", (event) => {
    if (waitingForLoot != undefined) {
        var text = event.message.getText()?.removeFormatting()
        if (DIVIDER.test(event.message)) {
            if (loots.length > 0) {
                if (text.length == 0) return;
                foundCorpse(data, waitingForLoot, loots);
                waitingForLoot = undefined;
                loots = [];
                return;
            }
        }
        var loot = adaptLootString(text)
        if (loot) loots.push(loot)
    } 
    if (testLoot) {
        var loot = adaptLootString(ChatLib.getChatMessage(event))
        sendModMessage(`Loot: ${loot.name} | Count: ${loot.count}`)
    }
})

let testLoot = false;
register("command", () => {
    if (!testLoot) {
        testLoot = true;
        sendModMessage("Started loot testing")
    } else {
        testLoot = false;
        sendModMessage("Stopped loot testing")
    }
    
}).setCommandName("mutest")
