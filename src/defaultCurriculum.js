import { programs } from "./subjectsData";

// A snapshot of the original courses, taken before the Admin changes anything
export const defaultPrograms = JSON.parse(JSON.stringify(programs));