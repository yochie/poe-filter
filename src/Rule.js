import getItemClass from "./ItemClass.js";
import { filterFactory } from "./Filter.js";
class Rule {
  category;
  forItemClass;
  filter;

  constructor(category, forItemClass, filter) {
    this.category = category;
    this.forItemClass = forItemClass;
    this.filter = filter;
  }

  print() {
    const output = `Show
Rarity <= Magic
Class "${this.forItemClass.name}"
${this.filter.print()}
AreaLevel >= 65

`;
    return output;
  }
}

const defaultRules = [];

defaultRules.push(
  new Rule(
    "Weapons",
    getItemClass("Two Hand Maces"),
    filterFactory.createDropLevelFilter(67),
  ),
);

defaultRules.push(
  new Rule(
    "Weapons",
    getItemClass("Bows"),
    filterFactory.createDropLevelFilter(72),
  ),
);

defaultRules.push(
  new Rule(
    "Weapons",
    getItemClass("Crossbows"),
    filterFactory.createBaseTypeFilter([
      "Expert Bombard Crossbow",
      "Expert Dyad Crossbow",
    ]),
  ),
);

defaultRules.push(
  new Rule(
    "Defences",
    getItemClass("Helmets", {
      hasArmour: true,
      hasEvasion: false,
      hasES: false,
    }),
    filterFactory.createDropLevelFilter(67),
  ),
);

defaultRules.push(
  new Rule(
    "Defences",
    getItemClass("Helmets", {
      hasES: true,
      hasArmour: false,
      hasEvasion: false,
    }),
    filterFactory.createDropLevelFilter(67),
  ),
);

export { Rule, defaultRules };
