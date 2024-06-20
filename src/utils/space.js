/**
 * Returns a spacing value based on a multiple of four.
 * @param {number} multipleOfFour - The multiplier for spacing.
 * @returns {string} The spacing value in pixels.
 */
export const space = (multipleOfFour = 1) => {
  return `${4 * multipleOfFour}px`;
};
