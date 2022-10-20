export default function sortByName(a: {name?: string}, b: {name?: string}) {
  return a.name > b.name ? 1 : -1;
}
