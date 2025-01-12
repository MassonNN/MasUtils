import { adaptLootString, foundCorpse } from "../../persistent/corpseStats"
import { CorpseType } from "./corpse"
import { data } from "../../index"

let waitingForLoot = undefined;
const DIVIDER = /.*[▬]{3,}.*/g

register("chat", (type) => {
    waitingForLoot = CorpseType[type];
    console.log("Started loot handling");
}).setChatCriteria("  ${type} CORPSE LOOT! ")

register("chat", () => {
    if (waitingForLoot != undefined) {
        var loots = [];
        var lines = 0;
        ChatLib.getChatLines().forEach(line => {
            if (DIVIDER.test(line.removeFormatting())) {
                if (lines > 0) {
                    if (loots.length == 0) return;
                    foundCorpse(data, waitingForLoot, loots);
                    waitingForLoot = undefined;
                    return;
                }
                lines++;
            }
            var loot = adaptLootString(line.removeFormatting())
            if (loot) loots.push(loot)
        })
    }
}).setChatCriteria(DIVIDER)
