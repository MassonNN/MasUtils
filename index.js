import { drawCoolWaypoint } from "./render.js"

let jungleCheeseCoords = undefined;
let guardians = [];

register("worldLoad", () => {
  jungleCheeseCoords = undefined;
});

// register("command", (args) => {
//   let x = ~~Player.getX();
//   let y = ~~Player.getY();
//   let z = ~~Player.getZ();
//   jungleCheeseCoords = [x, y, z]
//   ChatLib.chat("&c[MasUtils] Waypoint for Jungle Cheese created!")
// }).setName("junglecheese").setAliases(["jch"]);

register("renderWorld", () => {
  if (jungleCheeseCoords != undefined) {
    drawCoolWaypoint(jungleCheeseCoords[0], jungleCheeseCoords[1], jungleCheeseCoords[2], 40, 150, 220, { name: "Jungle Cheese", phase: true, nameColor: "c" })
  }
})


register("renderEntity", (entity, position, partialTicks, event) => {
  if (entity.getName().includes("Kalhuiki Door Guardian") && jungleCheeseCoords == undefined) {
    jungleCheeseCoords = [~~entity.getX() + 61, ~~entity.getY() - 44, ~~entity.getZ() + 18]
    ChatLib.chat("&c[MasUtils] Found Door Guardian and created Jungle cheese waypoint!")
  }
});
