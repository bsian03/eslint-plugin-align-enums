import { name, version } from "../package.json";
import { rules as _rules } from "./rules";

export const meta = { name, version };
export const rules = _rules;

const exportDefault = {
  meta,
  rules,
};

export default exportDefault;
