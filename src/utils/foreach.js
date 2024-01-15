async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item, array.indexOf(item), array);
  }
}

export default asyncForEach