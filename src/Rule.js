import { getItemClassByName, getItemClassInSubCategory } from "./ItemClass.js";
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
    getItemClassByName("Two Hand Maces"),
    filterFactory.createDropLevelFilter(67),
  ),
);

defaultRules.push(
  new Rule(getItemClassByName("Bows"), filterFactory.createDropLevelFilter(72)),
);

defaultRules.push(
  new Rule(
    getItemClassByName("Crossbows"),
    filterFactory.createBaseTypeFilter([
      "Expert Bombard Crossbow",
      "Expert Dyad Crossbow",
    ]),
  ),
);

defaultRules.push(
  new Rule(
    getItemClassInSubCategory("Helmets", {
      hasArmour: true,
      hasEvasion: false,
      hasES: false,
    }),
    filterFactory.createDropLevelFilter(67),
  ),
);

defaultRules.push(
  new Rule(
    getItemClassInSubCategory("Helmets", {
      hasArmour: true,
      hasEvasion: true,
      hasES: false,
    }),
    filterFactory.createDropLevelFilter(67),
  ),
);

export { Rule, defaultRules };
