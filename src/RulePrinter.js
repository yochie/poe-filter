//todo: use neversync filter as base, integrate printed rules to it

export function printRules(rules) {
  return rules.reduce((acc, rule) => {
    if (rule.forItemClass === null) {
      return acc;
    }
    return acc + rule.print();
  }, "");
}
