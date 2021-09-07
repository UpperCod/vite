import path from "path";
import pluginLiquid from "../../src/module.js";

/**
 * @type {import("vite").UserConfig}
 */
const config = {
    root: path.join(process.cwd(), "tests/example/"),
    build: {
        target: "esnext",
    },
    plugins: [pluginLiquid()],
};

export default config;
