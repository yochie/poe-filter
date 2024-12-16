import { printBaseTypeFilter, printDropLevelFilter } from "./FilterPrinter.js";

class DropLevelFilter {
  cutoffLevel;
  printer;
  constructor(cutoffLevel, printer) {
    this.cutoffLevel = cutoffLevel;
    this.printer = printer;
  }

  print() {
    return this.printer(this);
  }
}

class BaseTypeFilter {
  includes;
  printer;

  constructor(includes, printer) {
    this.includes = includes;
    this.printer = printer;
  }

  print() {
    return this.printer(this);
  }
}

class FilterFactory {
  dropLevelPrinter;
  baseTypePrinter;

  constructor(dropLevelPrinter, baseTypePrinter) {
    this.dropLevelPrinter = dropLevelPrinter;
    this.baseTypePrinter = baseTypePrinter;
  }

  createDropLevelFilter(level) {
    return new DropLevelFilter(level, this.dropLevelPrinter);
  }

  createBaseTypeFilter(baseTypes) {
    return new BaseTypeFilter(baseTypes, this.baseTypePrinter);
  }
}

const filterFactory = new FilterFactory(
  printDropLevelFilter,
  printBaseTypeFilter,
);

export { filterFactory };
