/**
 * @param {Array} array - array to be loop
 * @param {Promise} callback - looping item 
 */
export async function asyncForEach<T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>): Promise<void> {
  for (const item of array) {
    await callback(item, array.indexOf(item), array);
  }
}