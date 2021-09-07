import path from "path";
import { copyFile, mkdir } from "fs/promises";

const files = {};

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
