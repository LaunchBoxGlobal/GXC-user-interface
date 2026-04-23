// format day-month-year
// export function formatDate(isoString) {
//   const date = new Date(isoString);
//   const options = { day: "2-digit", month: "short", year: "numeric" };
//   return date
//     .toLocaleDateString("en-GB", options)
//     .replace(/ /g, " ")
//     .replace(",", ",");
// }

// US-format month-day-year
export function formatDate(isoString) {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
