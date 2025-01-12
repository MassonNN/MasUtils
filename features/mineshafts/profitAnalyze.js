import { Counter } from "../../lovejs";

const ANALYZE_SCAN_MAX_X = 20;
const ANALYZE_SCAN_MAX_Y = 20;
const ANALYZE_SCAN_MAX_Z = 10;


export function countBlock() {
    let blockCounter = new Counter()
    for (var x = Player.getX() - ANALYZE_SCAN_MAX_X; x < Player.getX() + ANALYZE_SCAN_MAX_X; x++) {
        for (var y = Player.getY() - ANALYZE_SCAN_MAX_Y; y < Player.getY() + ANALYZE_SCAN_MAX_Y; y++) {
            for (var z = Player.getZ() - ANALYZE_SCAN_MAX_Z; z < Player.getZ() + ANALYZE_SCAN_MAX_Z; z++) {
                var type = World.getBlockAt(x, y, z).type;
                blockCounter.increase(type.toString())
            }
        }
    }
    return blockCounter
}