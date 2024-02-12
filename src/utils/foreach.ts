/**
 * @description looping any array
 * @param {Array} array array to be loop
 * @param {Promise} callback ooping item 
 * @returns {Promise<void>}
 */
export async function asyncForEach<T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>): Promise<void> {
  for (const item of array) {
    await callback(item, array.indexOf(item), array);
  }
}