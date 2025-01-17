import {
  @ButtonProperty,
  @CheckboxProperty,
  Color,
  @ColorProperty,
  @PercentSliderProperty,
  @SelectorProperty,
  @SwitchProperty,
  @TextProperty,
  @Vigilant,
} from 'Vigilance';

@Vigilant('MasUtils', 'MasUtils - Skyblock Utilities', {
  getCategoryComparator: () => (a, b) => {
    const categories = ['General', 'Mining', 'Dev'];
    return categories.indexOf(a.name) - categories.indexOf(b.name);
  },
  getSubcategoryComparator: () => (a, b) => {
    const subcategories = ['Nucleus Runs', 'Gemstone Mining', 'Mineshafts', 'Vanguard', 'Rift'];
    return subcategories.indexOf(a.name) - subcategories.indexOf(b.name);
  },
})
class Settings {
  @SwitchProperty({
    name: 'Check for updates',
    description: 'Send you a notification about new update released',
    category: 'General',
  })
  checkForUpdates = true;

  @SwitchProperty({
    name: 'Jungle Temple Cheese',
    description: 'Create a waypoint for Armadillo Jungle Temple cheese when you are near Door Guardians',
    category: 'Mining',
    subcategory: 'Nucleus Runs'
  })
  jungleTempleCheese = true;

  @SwitchProperty({
    name: 'Mineshaft Corpse Finder',
    description: 'Feature to find corpses when in a mineshaft',
    category: 'Mining',
    subcategory: 'Mineshafts'
  })
  corpseFinder = false;

  @SwitchProperty({
    name: 'Mineshaft Profit Hint',
    description: 'Send you a notification have you to mine this mineshaft for profits or not',
    category: 'Mining',
    subcategory: 'Mineshafts'
  })
  mineshaftHinter = false;

  @SwitchProperty({
    name: 'Mineshaft Party Mode',
    description: 'Use if you are want to spawn mineshafts with your party',
    category: 'Mining',
    subcategory: 'Mineshafts'
  })
  mineshaftParty = false;

  @SwitchProperty({
    name: 'Auto Warp to Mineshaft',
    description: 'Warp your party if you have spawned a mineshaft',
    category: 'Mining',
    subcategory: 'Mineshafts'
  })
  autoWarpMineshaft = false;

  @SwitchProperty({
    name: 'Auto Transfer Party',
    description: 'Transfer party to other MasUtils users in your party when they have spawned a mineshaft',
    category: 'Mining',
    subcategory: 'Mineshafts'
  })
  autoTransferPartyOnMineshaft = false;

  @TextProperty({
    name: 'Custom text on Mineshaft spawn',
    description: 'Send in your party custom message about Mineshaft spawned (for compatibility with other mods you can send !ptme)',
    category: 'Mining',
    subcategory: 'Mineshafts',
    placeholder: 'This message will be sent in party chat'
  })
  messageOnMineshaftSpawned = "Found mineshaft! (About to warp)";

  @SwitchProperty({
    name: 'Mineshaft Waypoint',
    description: 'When Mineshaft has spawned creates a waypoint and trace for it',
    category: 'Mining',
    subcategory: 'Mineshafts'
  })
  mineshaftWaypoint = false;

  @SwitchProperty({
    name: 'Party Commands',
    description: 'Enable party commands (!help)',
    category: 'General',
  })
  partyCommands = false;

  @ColorProperty({
    name: 'Color of mineshaft trace',
    description: 'Select a color of trace to spawned mineshaft',
    category: 'Mining',
    subcategory: 'Mineshafts',
  })
  traceColor = Color.BLUE;


  @SelectorProperty({
    name: 'Trace thickness',
    description: 'Select a trace line thickness',
    category: 'Mining',
    subcategory: 'Mineshafts',
    options: ['1', '2', '3', '4', '5'],
  })
  traceThickness = 0; 

  @SwitchProperty({
    name: 'Debug',
    description: 'Print to console debug',
    category: 'Dev'
  })
  debug = false;


  constructor() {
    this.initialize(this);

    this.setCategoryDescription('General', 'General stuff');
    this.setCategoryDescription('Mining', 'Mining stuff');
    this.setCategoryDescription('Dev', 'Features for development');
    this.setSubcategoryDescription('Mining', 'Nucleus Runs', 'Features for Nucleus Runs');
    this.setSubcategoryDescription('Mining', 'Mineshafts', 'Features for Mineshafts');

    this.addDependency('Auto Warp to Mineshaft', 'Mineshaft Party Mode');
    this.addDependency('Auto Transfer Party', 'Mineshaft Party Mode');
    this.addDependency('Custom text on Mineshaft spawn', 'Mineshaft Party Mode');
    this.addDependency('Color of mineshaft trace', 'Mineshaft Waypoint');
  }
}

export default new Settings();
