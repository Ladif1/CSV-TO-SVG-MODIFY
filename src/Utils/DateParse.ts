
/**
 * Converts a date string to ISO 8601 format.
 * @param dateStr - The date string to convert.
 * @returns The date string in ISO 8601 format.
 */
function convertToISO8601(dateStr: string): string {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}T${dateStr.substring(9, 11)}:${dateStr.substring(11, 13)}:${dateStr.substring(13, 15)}Z`;
}

/**
 * Parses a date string and returns a Date object.
 * @param dateStr - The date string to parse.
 * @returns A Date object representing the parsed date.
 */
function parseDate(dateStr: string): Date {
    const isoDateStr = convertToISO8601(dateStr);
    return new Date(isoDateStr);
}

/**
 * Calculates the duration between two dates in milliseconds.
 * @param start The start date.
 * @param end The end date.
 * @returns The duration between the start and end dates in milliseconds.
 */
function getDuration(start: Date, end: Date): number {
    const duration = end.getTime() - start.getTime();
    return duration;
}

// Function to calculate color based on duration
/**
 * Calculates the color based on the duration, minimum duration, and maximum duration.
 * The color is interpolated between red and green based on the ratio of the duration
 * between the minimum and maximum durations.
 *
 * @param duration - The duration value.
 * @param minDuration - The minimum duration value.
 * @param maxDuration - The maximum duration value.
 * @returns The calculated color in the format "rgb(red,green,0)".
 */
function calculateColor(duration: number, minDuration: number, maxDuration: number): string {
    const ratio = (duration - minDuration) / (maxDuration - minDuration);
    const red = Math.round(255 * ratio);
    const green = Math.round(255 * (1 - ratio));
    return `rgb(${red},${green},0)`; // Interpolation between red and green
}

export { parseDate, getDuration, calculateColor };