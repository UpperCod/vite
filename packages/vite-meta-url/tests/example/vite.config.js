import path from "path";
import pluginMetaUrl from "../../src/module.js";

/**
 * @type {import("vite").UserConfig}
 */
const config = {
    root: path.join(process.cwd(), "tests/example/"),
    build: {
        target: "esnext",
        polyfillModulePreload: false,
    },
    plugins: [
        pluginMetaUrl({
            svg: true,
            async css() {
                return { inline: "`.my-css{color:red}`" };
            },
        }),
    ],
};

export default config;
