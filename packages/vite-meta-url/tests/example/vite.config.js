import path from "path";
import pluginMetaUrl from "../../src/module.js";

/**
 * @type {import("vite").UserConfig}
 */
const config = {
    root: path.join(process.cwd(), "tests/example/"),
    build: {
        target: "esnext",
        polyfillDynamicImport: false,
    },
    plugins: [
        pluginMetaUrl({
            svg: true,
            async css() {
                return ".my-css{color:red}";
            },
        }),
    ],
};

export default config;
