import getItemClass from "./ItemClass.js";
import { filterFactory } from "./Filter.js";
class Rule {
  forItemClass;
  filter;

  constructor(forItemClass, filter) {
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
    getItemClass("Two Hand Maces"),
    filterFactory.createDropLevelFilter(67),
  ),
);

defaultRules.push(
  new Rule(getItemClass("Bows"), filterFactory.createDropLevelFilter(72)),
);

defaultRules.push(
  new Rule(
    getItemClass("Crossbows"),
    filterFactory.createBaseTypeFilter([
      "Expert Bombard Crossbow",
      "Expert Dyad Crossbow",
    ]),
  ),
);

defaultRules.push(
  new Rule(
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
    getItemClass("Helmets", {
      hasES: true,
      hasArmour: false,
      hasEvasion: false,
    }),
    filterFactory.createDropLevelFilter(67),
  ),
);

export default defaultRules;
