//todo: use neversync filter as base, integrate printed rules to it

function printRule(rule) {
  return `Show
Rarity <= Magic
Class "${rule.forItemClass.name}"
${rule.filter.print()}
AreaLevel >= 65

`;
}

export function printRules(rules) {
  return rules.reduce((acc, rule) => {
    if (rule.forItemClass === null) {
      return acc;
    }
    return acc + printRule(rule);
  }, "");
}
