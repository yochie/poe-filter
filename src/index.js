import "./styles.css";
import * as form from "./RuleForm.js";
import { Rule } from "./Rule.js";
import { filterFactory } from "./Filter.js";
import { getItemClassByName, getItemClassInSubCategory } from "./ItemClass.js";

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

form.init(defaultRules);

console.log("hello");
