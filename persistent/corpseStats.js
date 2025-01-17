import { PersistentData } from "./data";
import { CorpseType } from "../features/mineshafts/corpse";
import Settings from "../settings";
import { sendModMessage } from "../utils";

let lootRegex = /\s*([a-zA-Z ]*) x(\d*)/g;

export class CorpseLoot {
    /** @type {String} */
    name;
    /** @type {Number} */
    count;

    constructor (name, count) {
        this.name = name;
        this.count = Number(count);
    }
}

/**
 * Found corpse incrementor
 * 
 * @param {PersistentData} data 
 * @param {CorpseType} corpseType
 * @param {ArrayList[CorpseLoot]} loots
 */
export function foundCorpse(data, corpseType, loots) {
    data.mineshafts.total_corpses += 1;
    data.mineshafts.detailed_count[corpseType] += 1;
    data.mineshafts.total_detailed_session_corpses[corpseType] += 1;
    data.mineshafts.total_session_corpses += 1;
    loots.forEach(loot => {
        data.mineshafts.total_loot[loot.name] += loot.count;
    });
    if (Settings.debug) 
        sendModMessage(`&rWrite corpse of type &3${corpseType}&r and &3${loots.length}&r loot(s)`)
    sendModMessage(`&rTotal profit of ${corpseType}: &30$&r!`)
}

/**
 * If a string matches loot string regex then return it CorpseLoot instance 
 * @param {String} lootString
 * @returns CorpseLoot instance
 */
export function adaptLootString(lootString) {
    var matches = lootRegex.exec(lootString)
    if (matches != null && matches.length == 3) {
        return new CorpseLoot(matches[1], matches[2])
    }
    return false;
}
