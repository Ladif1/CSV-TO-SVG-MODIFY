var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

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


async function main() {
    const data = await fs.promises.readFile('dataExport.csv', 'utf8');
    const lines = data.split('\n');
    const SallesMap = new Map<string, number>(); // <location, totalDuration>

    // Parse data to fill SallesMap
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const cells = line.split(',');
        const location = cells[4].trim();
        const start = parseDate(cells[2]);
        const end = parseDate(cells[3]);
        const duration = getDuration(start, end);
        SallesMap.set(location, (SallesMap.get(location) || 0) + duration);
    }

    // Determine min and max durations
    let minDuration = Infinity, maxDuration = 0;
    SallesMap.forEach((duration) => {
        if (duration < minDuration) minDuration = duration;
        if (duration > maxDuration) maxDuration = duration;
    });


    // Read and parse the SVG
    const svg = await fs.promises.readFile('IUT-ETAGE1b.svg', 'utf8');
    const dom = new JSDOM(svg, { contentType: "image/svg+xml" });
    const parser = new dom.window.DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");

    // Apply colors
    for (const [key, duration] of SallesMap.entries()) {
        const element = doc.getElementById(key);
        if (element) {
            element.style.fill = calculateColor(duration, minDuration, maxDuration);
        }
    }

    // Serialize and save the modified SVG
    const serializer = new dom.window.XMLSerializer();
    const modifiedSvg = serializer.serializeToString(doc);
    await fs.promises.writeFile('IUT-ETAGE1b-modified.svg', modifiedSvg, 'utf8');
    console.log(`SVG file modified with colors based on duration.`);
}


main();