import Settings from "./settings"
import { PersistentData } from "./persistent/data";
import { trace, drawCoolWaypoint } from './render'
import { traces, waypoints } from './utils'

let scanEntities = false;
export let data = new PersistentData();

register("renderWorld", () => {
  waypoints.forEach(waypoint => {
      drawCoolWaypoint(
          waypoint.x, waypoint.y, waypoint.z, 
          Settings.traceColor.getRed() / 255, 
          Settings.traceColor.getGreen() / 255, 
          Settings.traceColor.getBlue() / 255, 
          { name: waypoint.text, phase: true, nameColor: "3", alpha: Settings.traceColor.getAlpha() / 255,  }
      )
  });

  traces.forEach(d_trace => {
    trace(
      d_trace.x + 0.5, d_trace.y + 0.5, d_trace.z + 0.5, 
      Settings.traceColor.getRed() / 255, 
      Settings.traceColor.getGreen() / 255, 
      Settings.traceColor.getBlue() / 255, 
      Settings.traceColor.getAlpha() / 255, 
      Settings.traceThickness + 1
    )
  });
  
  if (scanEntities) {
    World.getAllEntities().forEach(entity => {
      drawCoolWaypoint(
        entity.getX(), entity.getY(), entity.getZ(), 
        Settings.traceColor.getRed() / 255, 
        Settings.traceColor.getGreen() / 255, 
        Settings.traceColor.getBlue() / 255, 
        { name: entity.getName(), phase: true, nameColor: "c", alpha: Settings.traceColor.getAlpha() / 255,  }
      )
    })
  }
})


register("command", (args1, ...args) => {
  if (args1 == undefined) {
    Settings.openGUI();
    return;
  } else {
    switch(args1.toLowerCase()) {
        case "settings":
        default:
            Settings.openGUI();
    }
  }
  
}).setTabCompletions(
    ["settings", ]
).setCommandName("mu", true)

register("gameUnload", () => {
  data.save()
})

import './features/mineshafts/spawn'
import './features/mineshafts/party'
import './features/mineshafts/corpse'
import './features/mineshafts/stats'
import './features/nucleus/jungleTemple'