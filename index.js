import Settings from "./settings"
import { PersistentData } from "./persistent/data";
import { trace, drawCoolWaypoint } from './render'
import { sendModMessage, traces, waypoints, addWaypoint } from './utils'

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
).setCommandName("MasUtils", true).setAliases(["mu", "masutil", "mutil", "mumenu"])

register("gameUnload", () => {
  data.save()
})

import './features/mineshafts/spawn'
import './features/mineshafts/party'
import './features/mineshafts/corpse'
import './features/mineshafts/stats'
import './features/nucleus/jungleTemple'