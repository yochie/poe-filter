function printDropLevelFilter(filter) {
  return `DropLevel ${filter.cutoffLevel}`;
}

function printBaseTypeFilter(filter) {
  return `BaseType ${filter.includes.map((s) => `"${s}"`).join(" ")}`;
}

export { printDropLevelFilter, printBaseTypeFilter };
