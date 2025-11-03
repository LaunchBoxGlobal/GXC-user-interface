export const toTitleCase = (text = "") => {
  return text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
