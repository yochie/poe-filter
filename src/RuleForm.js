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

function createSectionHeader(itemClass, section) {
  const sectionHeader = document.createElement("div");
  sectionHeader.classList.add("item-class-section-header");

  const sectionEnabledCheckbox = document.createElement("input");
  sectionEnabledCheckbox.type = "checkbox";
  sectionEnabledCheckbox.addEventListener("change", () =>
    enableSection(section, sectionEnabledCheckbox.checked),
  );
  sectionHeader.appendChild(sectionEnabledCheckbox);

  const title = document.createElement("h3");
  title.textContent = itemClass.name;
  sectionHeader.appendChild(title);

  section.appendChild(sectionHeader);
}

function createFilterTypeOptions(
  fieldset,
  sectionID,
  optionID,
  optionLabel,
  enablesID,
) {
  const input = document.createElement("input");
  const fieldID = `${optionID}-${sectionID}`;
  input.type = "radio";
  input.name = "filter";
  input.value = optionID;
  input.id = fieldID;
  input.setAttribute("data-enables-field", enablesID);
  fieldset.appendChild(input);

  const label = document.createElement("label");
  label.textContent = optionLabel;
  label.setAttribute("for", fieldID);
  fieldset.appendChild(label);
}

function createLevelField(container, fieldID) {
  const wrapper = document.createElement("div");
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("level-filter");

  const levelFilterID = fieldID;
  const label = document.createElement("label");
  label.textContent = "Cutoff level";
  label.setAttribute("for", levelFilterID);
  fieldset.appendChild(label);

  const input = document.createElement("input");
  input.type = "number";
  input.setAttribute("id", levelFilterID);
  fieldset.appendChild(input);
  wrapper.appendChild(fieldset);
  container.appendChild(wrapper);
}

function createBaseField(container, fieldID) {
  const wrapper = document.createElement("div");
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("base-filter");

  const label = document.createElement("label");
  label.textContent = "Base Types";
  label.setAttribute("for", fieldID);
  fieldset.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("id", fieldID);
  fieldset.appendChild(input);
  wrapper.appendChild(fieldset);
  container.appendChild(wrapper);
}

//todo : currently hardcoded for field types, not respecting open-closed
// need to find solution that doesnt require defining everything inside item class definition
function createFilterTypeFieldset(
  container,
  sectionID,
  levelFieldID,
  baseFieldID,
) {
  const filterTypeFieldset = document.createElement("fieldset");
  filterTypeFieldset.classList.add("filter-type-field");

  const legend = document.createElement("legend");
  legend.textContent = "Filter Type";
  filterTypeFieldset.appendChild(legend);

  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options-container");
  createFilterTypeOptions(
    optionsContainer,
    sectionID,
    "level",
    "Drop Level",
    levelFieldID,
  );
  createFilterTypeOptions(
    optionsContainer,
    sectionID,
    "base-type",
    "Base Type",
    baseFieldID,
  );
  filterTypeFieldset.appendChild(optionsContainer);

  container.appendChild(filterTypeFieldset);
}

function createItemClassSection(itemClass) {
  const section = document.createElement("div");
  const sectionID = itemClass.name.replace(/\s/g, "-");

  createSectionHeader(itemClass, section);
  const sectionFields = document.createElement("div");
  sectionFields.classList.add("section-fields");

  //Hardcoded fields here
  //should find way to respect open closed principle
  //not sure how to go about this without bloating the rule class
  //some pattern has to apply...
  const levelFieldID = `level-cutoff-${sectionID}`;
  const baseFieldID = `bases-${sectionID}`;
  createFilterTypeFieldset(sectionFields, sectionID, levelFieldID, baseFieldID);

  const toggledFields = document.createElement("div");
  toggledFields.classList.add("toggled-fields");
  createLevelField(toggledFields, levelFieldID);
  createBaseField(toggledFields, baseFieldID);
  sectionFields.appendChild(toggledFields);
  section.appendChild(sectionFields);

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

  form.addEventListener("change", (e) => {
    if (e.target.name !== "filter") {
      return;
    }
    const toEnable = e.target.getAttribute("data-enables-field");

    const toggledFields = document.querySelector(
      `.toggled-fields:has(#${toEnable})`,
    );
    for (let field of toggledFields.childNodes) {
      if (field.querySelector(`#${toEnable}`) !== null) {
        field.querySelector("fieldset").removeAttribute("disabled");
        field.style.display = "block";
      } else {
        field.style.display = "none";
        field.querySelector("fieldset").setAttribute("disabled", "");
      }
    }
  });
  form.addEventListener("submit", download);
}

export { init };
