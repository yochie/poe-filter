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

function createSectionHeader(itemClass, section, sectionID) {
  const sectionHeader = document.createElement("div");
  sectionHeader.classList.add("item-class-section-header");

  const checkboxID = `${sectionID}-enabled`;
  const sectionEnabledCheckbox = document.createElement("input");
  sectionEnabledCheckbox.setAttribute("id", checkboxID);
  sectionEnabledCheckbox.type = "checkbox";
  sectionEnabledCheckbox.addEventListener("change", () =>
    enableSection(section, sectionEnabledCheckbox.checked),
  );
  sectionHeader.appendChild(sectionEnabledCheckbox);

  const label = document.createElement("label");
  label.setAttribute("for", checkboxID);
  const title = document.createElement("h3");
  title.textContent = itemClass.name;
  label.appendChild(title);
  sectionHeader.appendChild(label);

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

function createLevelField(container, fieldsetID) {
  const wrapper = document.createElement("div");
  const fieldset = document.createElement("fieldset");
  fieldset.setAttribute("id", fieldsetID);
  fieldset.classList.add("level-filter");

  const fieldID = `${fieldsetID}-field`;
  const label = document.createElement("label");
  label.textContent = "Cutoff level";
  label.setAttribute("for", fieldID);
  fieldset.appendChild(label);

  const input = document.createElement("input");
  input.type = "number";
  input.setAttribute("id", fieldID);
  fieldset.appendChild(input);
  wrapper.appendChild(fieldset);
  container.appendChild(wrapper);
}

function createBaseField(container, fieldsetID, itemClass) {
  const wrapper = document.createElement("div");
  const fieldset = document.createElement("fieldset");
  fieldset.setAttribute("id", fieldsetID);
  fieldset.classList.add("base-filter");

  const legend = document.createElement("legend");
  legend.textContent = "Base Types";
  fieldset.appendChild(legend);

  const fieldName = fieldsetID;

  for (let baseType of itemClass.baseTypes) {
    const baseTypeAsID = baseType.replace(/\s/g, "-").toLowerCase();
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("id", baseTypeAsID);
    input.setAttribute("name", fieldName);
    fieldset.appendChild(input);

    const label = document.createElement("label");
    label.setAttribute("for", baseTypeAsID);
    label.textContent = baseType;
    fieldset.appendChild(label);
  }
  wrapper.appendChild(fieldset);
  container.appendChild(wrapper);
}

function createFilterTypeFieldset(
  container,
  sectionID,
  levelFieldsetID,
  baseFieldsetID,
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
    levelFieldsetID,
  );
  createFilterTypeOptions(
    optionsContainer,
    sectionID,
    "base-type",
    "Base Type",
    baseFieldsetID,
  );
  filterTypeFieldset.appendChild(optionsContainer);

  container.appendChild(filterTypeFieldset);
}

function createItemClassSection(itemClass) {
  const section = document.createElement("div");
  const sectionID = itemClass.id;

  createSectionHeader(itemClass, section, sectionID);
  const sectionFields = document.createElement("div");
  sectionFields.classList.add("section-fields");

  //Hardcoded fields here
  //should find way to respect open closed principle
  //not sure how to go about this without bloating the rule class
  //some pattern has to apply...
  const levelFieldsetID = `level-cutoff-${sectionID}`;
  const baseFieldsetID = `bases-${sectionID}`;
  createFilterTypeFieldset(
    sectionFields,
    sectionID,
    levelFieldsetID,
    baseFieldsetID,
  );

  const toggledFields = document.createElement("div");
  toggledFields.classList.add("toggled-fields");
  createLevelField(toggledFields, levelFieldsetID);
  createBaseField(toggledFields, baseFieldsetID, itemClass);
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
    for (let toggled of toggledFields.childNodes) {
      const fieldset = toggled.querySelector("fieldset");
      if (fieldset.getAttribute("id") === toEnable) {
        toggled.removeAttribute("disabled");
        toggled.style.display = "block";
      } else {
        toggled.style.display = "none";
        toggled.setAttribute("disabled", "");
      }
    }
  });
  form.addEventListener("submit", download);
}

export { init };
