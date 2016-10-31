import { getProgressFromValue, getValueFromProgress, stepProgress } from './calc';

/**
 * Append Unit
 * Creates a function that will append the unit to a given value
 * appendUnit('px')(20) -> '20px'
 * @param  {string} unit)
 * @return {number}
 */
export const appendUnit = (unit) => (v) => `${v}${unit}`;

/**
 * Flow
 * Compose other transformers to run linearily
 * flow(min(20), max(40))
 * @param  {...functions} transformers
 * @return {function}
 */
export const flow = (...transformers) => {
  const numTransformers = transformers.length;
  let i = 0;

  return (v) => {
    for (i = 0; i < numTransformers; i++) {
      v = transformers[i](v);
    }

    return v;
  };
};

export const interpolate = (input, output, rangeEasing) => {
  const rangeLength = input.length;
  const finalIndex = rangeLength - 1;

  return (v) => {
    // If value outside minimum range, quickly return
    if (v <= input[0]) {
      return output[0];
    }

    // If value outside maximum range, quickly return
    if (v >= input[finalIndex]) {
      return output[finalIndex];
    }

    let i = 0;

    // Find index of range start
    for (; i < rangeLength; i++) {
      if (input[i] > v || i === finalIndex) {
        break;
      }
    }

    const progressInRange = getProgressFromValue(input[i], input[i + 1], v);
    const easedProgress = (rangeEasing) ? rangeEasing[i](progressInRange) : progressInRange;
    return getValueFromProgress(output[i], output[i + 1], easedProgress);
  };
};

/**
 * Clamp value between
 * Creates a function that will restrict a given value between `min` and `max`
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
export const clampUnder = (max) => (v) => Math.min(v, max);
export const clampOver = (min) => (v) => Math.max(v, min);
export const clamp = (min, max) => flow(clampOver(min), clampUnder(max));

export const steps = (steps, min, max) => (v) => {
  const progress = getProgressFromValue(min, max, v);
  return stepProgress(steps, progress);
};

