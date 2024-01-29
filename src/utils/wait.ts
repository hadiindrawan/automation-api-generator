/**
 * @param {number} ms - explicit time for wait
 */
export const waitFor = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));