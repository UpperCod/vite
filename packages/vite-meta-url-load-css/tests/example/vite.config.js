import path from "path";
import pluginMetaUrl from "@uppercod/vite-meta-url";
import loadCss from "../../src/module.js";

/**
 * @type {import("vite").UserConfig}
 */
const config = {
    root: path.join(process.cwd(), "tests/example/"),
    build: {
        target: "esnext",
    },
    plugins: [
        pluginMetaUrl({
            css: loadCss(),
        }),
    ],
};

export default config;
