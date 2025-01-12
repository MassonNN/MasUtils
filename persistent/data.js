const MAS_UTILS = "MasUtils";
const DATA = "data.json";

class MineshaftsData {
    /** @type {Number} */
    total_count;
    /** @type {JSON} */
    detailed_count;
    /** @type {Number} */
    since_last;
    /** @type {Number} */
    spawned_by_partymates;
    /** @type {Number} */
    total_corpses;
    /** @type {JSON} */
    detailed_corpses;
    /** @type {Number} */
    total_session_corpses;
    /** @type {JSON} */
    total_detailed_session_corpses;
    /** @type {Number} */
    session_start;
    /** @type {JSON} */
    total_loot;
    /** @type {JSON} */
    session_loot;

    constructor(
        total_count, detailed_count, since_last, spawned_by_partymates, total_corpses, detailed_corpses, 
        total_session_corpses, total_detailed_session_corpses, session_start, total_loot, session_loot
    ) {
        this.total_count = total_count || 0
        this.detailed_count = detailed_count || 0
        this.since_last = since_last || 0
        this.spawned_by_partymates = spawned_by_partymates || 0
        this.total_corpses = total_corpses || 0
        this.detailed_corpses = detailed_corpses || {}
        this.total_session_corpses = total_session_corpses || 0
        this.total_detailed_session_corpses = total_detailed_session_corpses || {}
        this.session_start = session_start || 0
        this.total_loot = total_loot || {}
        this.session_loot = session_loot || {}
    }
}

class NucleusData{
    /** @type {Number} */
    session_start;
    /** @type {JSON} */
    total_loot;
    /** @type {JSON} */
    session_loot;
    /** @type {Number} */
    personal_best;
    /** @type {Number} */
    personal_average;

    constructor (
        session_start=0, total_loot={}, session_loot={}, 
        personal_best=0, personal_average=0
    ) {
        this.session_start = session_start
        this.total_loot = total_loot
        this.session_loot = session_loot
        this.personal_best = personal_best
        this.personal_average = personal_average
    }
}

class TelemetryData{
    /** @type {Number} */
    imported_at;
    /** @type {Number} */
    game_sessions;
    /** @type {Number} */
    mineshaft_sessions;
    /** @type {Number} */
    nucleus_runs_did;

    constructor (imported_at=0, game_sessions=0, mineshaft_sessions=0, nucleus_runs_did=0) {
        this.imported_at = imported_at
        this.game_sessions = game_sessions
        this.mineshaft_sessions = mineshaft_sessions
        this.nucleus_runs_did = nucleus_runs_did
    }
}

export class PersistentData {
    /** @type {MineshaftsData} */
    mineshafts;
    /** @type {NucleusData} */
    nucleus;
    /** @type {TelemetryData} */
    telemetry;

    constructor () {
        let data = verifyPersistent()
        this.mineshafts = Object.assign(new MineshaftsData(), data['mineshafts']);
        this.nucleus = Object.assign(new NucleusData(), data['nucleus']);
        this.telemetry = Object.assign(new TelemetryData(), data['telemetry']);
    }

    save () {
        FileLib.write(MAS_UTILS, DATA, JSON.stringify(this))
    }
}

function verifyPersistent() {
    const data = FileLib.read(MAS_UTILS, DATA)
    return data;
}