import test from "ava";
import { readFile } from "fs/promises";
import glob from "fast-glob";

test("simple replace", async (t) => {
    const files = await glob("tests/example/dist/assets/*");
    await Promise.all(
        files.map(async (file) => {
            const [, filename] = file.match(/\/(\w+)\.\w+.\w+/);
            t.is(
                await readFile(file, "utf-8"),
                await readFile(
                    new URL(`example/expect-${filename}.txt`, import.meta.url),
                    "utf-8"
                )
            );
        })
    );
});
