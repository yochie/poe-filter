class ItemClass {
  category;
  name;
  baseTypes;
  advancedLevel;
  expertLevel;
  id;

  constructor(category, name, baseTypes, advancedLevel, expertLevel) {
    this.category = category;
    this.name = name;
    this.baseTypes = baseTypes;
    this.advancedLevel = advancedLevel;
    this.expertLevel = expertLevel;
    this.id = name.replace(/\s/g, "-").replace(/\//g, "-").toLowerCase();
  }
}

class DefenseItemClass extends ItemClass {
  subCategory;
  hasArmour;
  hasEvasion;
  hasES;

  constructor(
    category,
    subCategory,
    name,
    baseTypes,
    advancedLevel,
    expertLevel,
    hasArmour,
    hasEvasion,
    hasES,
  ) {
    super(category, name, baseTypes, advancedLevel, expertLevel);
    this.subCategory = subCategory;
    this.hasArmour = hasArmour;
    this.hasEvasion = hasEvasion;
    this.hasES = hasES;
  }
}

//Only listing expert base types for now
const itemClasses = [];

itemClasses.push(
  new ItemClass(
    "Weapons",
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
    "Weapons",
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
    "Defences",
    "Helmets",
    "Armor Helmets",
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
    "Defences",
    "Helmets",
    "Armor/Evasion Helmets",
    ["Expert Guarded Helm", "Expert Cowled Helm", "Expert Shielded Helm"],
    45,
    65,
    true,
    true,
    false,
  ),
);

function getItemClassByName(name) {
  for (let itemClass of itemClasses) {
    if (itemClass.name === name) {
      return itemClass;
    }
  }

  return null;
}
function getItemClassInSubCategory(subCategory, withDefenceType) {
  for (let itemClass of itemClasses) {
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
  return null;
}

export { getItemClassByName, getItemClassInSubCategory };
