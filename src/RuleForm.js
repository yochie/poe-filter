import { Rule } from "./Rule.js";
import { printRules } from "./RulePrinter.js";
const form = document.querySelector("form");
let defaultRules;

function load(rules) {}

function download() {
  //todo : parse form
  // rules = parse();
  const rules = defaultRules;
  const fileContent = printRules(rules);

  //todo : output file content to element that is clicked
  // see https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
  console.log(fileContent);
}

function parse() {}

function generateFields(rules) {
  const formCategories = new Map();
  for (let rule of rules) {
    const { forItemClass: ruleItemClass } = rule;
    if (ruleItemClass === null) {
      continue;
    }
    const mainCategoryName = ruleItemClass.category;

    if (!formCategories.has(mainCategoryName)) {
      const newCategory = createCategory(mainCategoryName);
      formCategories.set(mainCategoryName, newCategory);
      form.appendChild(newCategory);
    }

    //add subcategory if applicable
    const goesInSubCategory = Object.hasOwn(ruleItemClass, "subCategory");
    if (goesInSubCategory) {
      const subCategoryName = ruleItemClass.subCategory;
      if (!formCategories.has(subCategoryName)) {
        const newSubCategory = createSubCategory(subCategoryName);
        formCategories.set(subCategoryName, newSubCategory);
        formCategories.get(mainCategoryName).appendChild(newSubCategory);
      }
    }

    //add rule to appropriate category/subcategory
    const newSection = createItemClassRule(ruleItemClass);
    if (goesInSubCategory) {
      formCategories.get(ruleItemClass.subCategory).appendChild(newSection);
    } else {
      formCategories.get(mainCategoryName).appendChild(newSection);
    }

    setRuleEnabled(newSection, false);
  }

  const submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.classList.add("submit-button");
  submitButton.textContent = "Generate";

  submitButton.addEventListener("click", download);
  form.appendChild(submitButton);

  //register handler for filter type toggling
  form.addEventListener("change", (e) => {
    const toEnable = e.target.getAttribute("data-enables-field");
    if (toEnable === null) {
      return;
    }

    const toggledFields = document.querySelector(
      `.toggled-fields:has(#${toEnable})`,
    );
    for (let toggled of toggledFields.childNodes) {
      if (toggled.getAttribute("id") === toEnable) {
        toggled.removeAttribute("disabled");
        toggled.style.display = "block";
      } else {
        toggled.style.display = "none";
        toggled.setAttribute("disabled", "");
      }
    }
  });
}

function createRuleHeader(itemClass, rule, ruleID) {
  const ruleHeader = document.createElement("div");
  ruleHeader.classList.add("rule-header");

  const checkboxID = `${ruleID}-enabled`;
  const ruleEnabledCheckbox = document.createElement("input");
  ruleEnabledCheckbox.setAttribute("id", checkboxID);
  ruleEnabledCheckbox.type = "checkbox";
  ruleEnabledCheckbox.addEventListener("change", () =>
    setRuleEnabled(rule, ruleEnabledCheckbox.checked),
  );
  ruleHeader.appendChild(ruleEnabledCheckbox);

  const label = document.createElement("label");
  label.setAttribute("for", checkboxID);
  const title = document.createElement("h3");
  title.textContent = itemClass.name;
  label.appendChild(title);
  ruleHeader.appendChild(label);

  rule.appendChild(ruleHeader);
}

function createFilterTypeOption(
  fieldset,
  ruleID,
  optionID,
  optionLabel,
  enablesID,
) {
  const input = document.createElement("input");
  const fieldID = `${optionID}-${ruleID}`;
  input.type = "radio";
  input.name = `filter-${ruleID}`;
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
  //used for toggling field from filter type
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", fieldsetID);

  const fieldset = document.createElement("fieldset");
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
  //used for toggling field from filter type
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", fieldsetID);

  const fieldset = document.createElement("fieldset");
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
  ruleID,
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
  createFilterTypeOption(
    optionsContainer,
    ruleID,
    "level",
    "Drop Level",
    levelFieldsetID,
  );
  createFilterTypeOption(
    optionsContainer,
    ruleID,
    "base-type",
    "Base Type",
    baseFieldsetID,
  );
  filterTypeFieldset.appendChild(optionsContainer);

  container.appendChild(filterTypeFieldset);
}

function createItemClassRule(itemClass) {
  const rule = document.createElement("div");
  rule.classList.add("rule");
  const ruleID = itemClass.id;

  createRuleHeader(itemClass, rule, ruleID);
  const ruleFields = document.createElement("div");
  ruleFields.classList.add("rule-fields");

  //Hardcoded fields here
  //should find way to respect open closed principle
  //not sure how to go about this without bloating the rule class
  //some pattern has to apply...
  const levelFieldsetID = `level-cutoff-${ruleID}`;
  const baseFieldsetID = `bases-${ruleID}`;
  createFilterTypeFieldset(ruleFields, ruleID, levelFieldsetID, baseFieldsetID);

  const toggledFields = document.createElement("div");
  toggledFields.classList.add("toggled-fields");
  createLevelField(toggledFields, levelFieldsetID);
  createBaseField(toggledFields, baseFieldsetID, itemClass);
  ruleFields.appendChild(toggledFields);
  rule.appendChild(ruleFields);

  return rule;
}

function setRuleEnabled(section, state) {
  const ruleContent = section.querySelector(".rule-fields");
  ruleContent.style.display = state ? "block" : "none";
}

function createCategory(name) {
  const newCategory = document.createElement("div");
  newCategory.classList.add("rule-category");

  const title = document.createElement("h2");
  title.textContent = name;
  newCategory.appendChild(title);
  return newCategory;
}

function createSubCategory(name) {
  const newCategory = document.createElement("div");
  newCategory.classList.add("rule-sub-category");

  const title = document.createElement("h3");
  title.textContent = name;
  newCategory.appendChild(title);
  return newCategory;
}

function init(rules) {
  defaultRules = rules;
  generateFields(rules);

  //todo: load from save instead if it exists
  load(rules);
}

export { init };
