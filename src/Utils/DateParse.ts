
function convertToISO8601(dateStr: string): string {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}T${dateStr.substring(9, 11)}:${dateStr.substring(11, 13)}:${dateStr.substring(13, 15)}Z`;
}

function parseDate(dateStr: string): Date {
    const isoDateStr = convertToISO8601(dateStr);
    return new Date(isoDateStr);
}

function getDuration(start: Date, end: Date): number {
    const duration = end.getTime() - start.getTime();
    return duration;
}

// Function to calculate color based on duration
function calculateColor(duration: number, minDuration: number, maxDuration: number): string {
    const ratio = (duration - minDuration) / (maxDuration - minDuration);
    const red = Math.round(255 * ratio);
    const green = Math.round(255 * (1 - ratio));
    return `rgb(${red},${green},0)`; // Interpolation between red and green
}

export { parseDate, getDuration, calculateColor };