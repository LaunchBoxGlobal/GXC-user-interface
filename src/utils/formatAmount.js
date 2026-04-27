export default function formatAmount(num) {
  return new Intl.NumberFormat("en-US").format(num);
}
