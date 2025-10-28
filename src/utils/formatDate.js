export function formatDate(isoString) {
  const date = new Date(isoString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date
    .toLocaleDateString("en-GB", options)
    .replace(/ /g, " ")
    .replace(",", ",");
}
