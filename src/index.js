import "./styles.css";
import defaultRules from "./Rule.js";

const rules = defaultRules;
const body = document.querySelector("pre");
const allRules = rules.reduce((acc, rule) => {
  if (rule.forItemClass === null) {
    return acc;
  }
  return acc + rule.print();
}, "");
body.textContent = allRules;
console.log("hello");
