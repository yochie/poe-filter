import { Rule, defaultRules } from "./Rule.js";
import { printRules } from "./RulePrinter.js";
const form = document.querySelector("form");

function load(rules) {}

function download() {
  const rules = parse();
  const fileContent = print(rules);

  //todo : output file content to element that is clicked
  // see https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
  console.log(fileContent);
}

function parse() {}

function generateFields(rules) {
  const categories = new Map();
  const itemClasses = new Map();
  for (let rule of rules) {
    const {
      category: ruleCategory,
      forItemClass: ruleItemClass,
      filter: ruleFilter,
    } = rule;
    if (ruleItemClass === null) {
      continue;
    }
    if (!categories.has(ruleCategory)) {
      const newCategory = createCategorySection(ruleCategory);
      categories.set(ruleCategory, newCategory);
      form.appendChild(newCategory);
    }
    if (!itemClasses.has(ruleItemClass)) {
      const newSection = createItemClassSection(ruleItemClass);
      itemClasses.set(ruleItemClass, newSection);
      categories.get(ruleCategory).appendChild(newSection);
    }
    enableSection(itemClasses.get(ruleItemClass), false);
  }
}

function createItemClassSection(itemClass) {
  const section = document.createElement("div");

  const sectionHeader = document.createElement("div");
  sectionHeader.classList.add("item-class-section-header");

  const sectionEnabledCheckbox = document.createElement("input");
  sectionEnabledCheckbox.type = "checkbox";
  sectionHeader.appendChild(sectionEnabledCheckbox);

  const title = document.createElement("h3");
  title.textContent = itemClass.name;
  sectionHeader.appendChild(title);

  section.appendChild(sectionHeader);

  const sectionFields = document.createElement("div");
  sectionFields.classList.add("section-fields");

  //todo : hardcoded for field types, not respecting open-closed
  // need to find solution that doesnt require defining everything inside item class definition
  // maybe decorator pattern??
  const filterTypeFieldSet = document.createElement("fieldset");

  const legend = document.createElement("legend");
  legend.textContent = "Type";
  legend.style.display = "none";
  filterTypeFieldSet.appendChild(legend);

  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options-container");

  const levelType = document.createElement("input");
  levelType.type = "radio";
  levelType.name = "filter";
  levelType.value = "dropLevel";
  levelType.id = `drop-level-${itemClass.name.replace(/\s/g, "-")}`;
  optionsContainer.appendChild(levelType);

  const levelTypeLabel = document.createElement("label");
  levelTypeLabel.textContent = "Drop level";
  levelTypeLabel.setAttribute("for", levelType.id);
  optionsContainer.appendChild(levelTypeLabel);

  const baseType = document.createElement("input");
  baseType.type = "radio";
  baseType.name = "filter";
  baseType.value = "baseType";
  baseType.id = `base-type-${itemClass.name.replace(/\s/g, "-")}`;
  optionsContainer.appendChild(baseType);

  const baseTypeLabel = document.createElement("label");
  baseTypeLabel.textContent = "Base type";
  baseTypeLabel.setAttribute("for", baseType.id);
  optionsContainer.appendChild(baseTypeLabel);

  filterTypeFieldSet.appendChild(optionsContainer);
  sectionFields.appendChild(filterTypeFieldSet);

  section.appendChild(sectionFields);

  sectionEnabledCheckbox.addEventListener("change", () =>
    enableSection(section, sectionEnabledCheckbox.checked),
  );
  return section;
}

function enableSection(section, state) {
  const sectionContent = section.querySelector(".section-fields");
  sectionContent.style.display = state ? "block" : "none";
}

function createCategorySection(name) {
  const newCategory = document.createElement("div");
  newCategory.classList.add("rule-category");

  const title = document.createElement("h2");
  title.textContent = name;
  newCategory.appendChild(title);
  return newCategory;
}

function init() {
  generateFields(defaultRules);

  //todo: load from save if it exists
  load(defaultRules);

  form.addEventListener("submit", download);
}

export { init };
