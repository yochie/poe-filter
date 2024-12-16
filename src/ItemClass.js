class ItemClass {
  name;
  baseTypes;
  advancedLevel;
  expertLevel;

  constructor(name, baseTypes, advancedLevel, expertLevel) {
    this.name = name;
    this.baseTypes = baseTypes;
    this.advancedLevel = advancedLevel;
    this.expertLevel = expertLevel;
  }
}

class DefenseItemClass extends ItemClass {
  hasArmour;
  hasEvasion;
  hasES;

  constructor(
    name,
    baseTypes,
    advancedLevel,
    expertLevel,
    hasArmour,
    hasEvasion,
    hasES,
  ) {
    super(name, baseTypes, advancedLevel, expertLevel);
    this.hasArmour = hasArmour;
    this.hasEvasion = hasEvasion;
    this.hasES = hasES;
  }
}

//Only listing expert base types for now
const itemClasses = [];

itemClasses.push(
  new ItemClass(
    "Crossbows",
    [
      "Expert Sturdy Crossbow",
      "Expert Varnished Crossbow",
      "Expert Tense Crossbow",
      "Expert Dyad Crossbow",
      "Expert Bombard Crossbow",
      "Expert Forlorn Crossbow",
    ],
    45,
    67,
  ),
);

itemClasses.push(
  new ItemClass(
    "Two Hand Maces",
    [
      "Expert Forge Maul",
      "Expert Temple Maul",
      "Expert Oak Greathammer",
      "Expert Cultist Greathammer",
      "Expert Crumbling Maul",
      "Expert Leaden Greathammer",
    ],
    45,
    67,
  ),
);

//      "Golden Wreath",
// "Golden Visage",
itemClasses.push(
  new DefenseItemClass(
    "Helmets",
    [
      "Expert Soldier Greathelm",
      "Expert Spired Greathelm",
      "Expert Elite Greathelm",
    ],
    45,
    65,
    true,
    false,
    false,
  ),
);

itemClasses.push(
  new DefenseItemClass(
    "Helmets",
    ["Expert Guarded Helm", "Expert Cowled Helm", "Expert Shielded Helm"],
    45,
    65,
    true,
    true,
    false,
  ),
);

function getItemClass(name, withDefenceType = null) {
  for (let itemClass of itemClasses) {
    if (itemClass.name == name) {
      if (withDefenceType == null) {
        return itemClass;
      }

      if (withDefenceType.hasArmour !== itemClass.hasArmour) {
        continue;
      }
      if (withDefenceType.hasEvasion !== itemClass.hasEvasion) {
        continue;
      }
      if (withDefenceType.hasES !== itemClass.hasES) {
        continue;
      }

      return itemClass;
    }
  }

  return null;
}

export default getItemClass;
