var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
import { parseDate, getDuration, calculateColor } from './Utils/DateParse';


/**
 * Main function that reads data from a CSV file, parses it, applies colors to an SVG file based on the parsed data,
 * and saves the modified SVG file.
 */
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