import { addWaypoint, removeWaypoint, removeWaypoints, sendModMessage } from "../../utils";
import Settings from "../../settings";

let jungleCheeseCoords = undefined;
let jungleTempleWP = 100;
let guardians = [];

register("worldLoad", () => {
  if (jungleCheeseCoords) removeWaypoints();
  jungleCheeseCoords = undefined;
});

register("renderEntity", (entity) => {
  if (entity.getName().includes("Kalhuiki Door Guardian") && jungleCheeseCoords == undefined && Settings.jungleTempleCheese) {
    guardians.push([~~entity.getX() + 61, ~~entity.getY() - 44, ~~entity.getZ() + 18])
    if (guardians.length == 2) {
      var leftGuardian = [];
      if (guardians[0][0] < guardians[1][0]) {
        leftGuardian = guardians[0];
      } else {
        leftGuardian = guardians[1];
      }
      jungleCheeseCoords = leftGuardian;
      addWaypoint("Jungle Temple Cheese", jungleCheeseCoords[0], jungleCheeseCoords[1], jungleCheeseCoords[2], jungleTempleWP)
      sendModMessage("Found Door Guardian and created Jungle cheese waypoint!")
    }
  }
});