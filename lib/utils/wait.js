/**
 * @description explicit time for wait
 * @param {number} ms number of time in millisecond
 * @returns {Promise<void>}
 */
export const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
