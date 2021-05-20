import path from "path";
import { copyFile, mkdir } from "fs/promises";

const files = {};

const TAG = /<\w+(-\w+){0,}\s+([^>]+)>/g;
const ATTR = /([\w-]+)=(?:\"((\.){0,2}\/[^\"]+)\"|\'((\.){0,2}\/[^\']+)\')/g;
/**
 *
 * @param {string} code
 * @param {(value:string,attribute:string)=>string} map
 */
export const mapHtmlAttrs = (code, map) =>
    code.replace(TAG, (all) =>
        all.replace(ATTR, (all, attr, value) => `${attr}="${map(value, attr)}"`)
    );

export const copy = (from, to) =>
    (files[from] =
        files[from] ||
        Promise.resolve(to)
            .then(prepareDir)
            .then(() => copyFile(from, to)));

export function prepareDir(to) {
    const dir = path.dirname(to);
    files[dir] =
        files[dir] || mkdir(dir, { recursive: true }).catch(() => true);
    return files[dir];
}
