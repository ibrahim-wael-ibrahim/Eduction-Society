const filter = (arr, key, value) => {
  return arr.filter((item) => item[key] === value);
}
export default filter;