import path from "path";
import { Liquid } from "liquidjs";
import tags from "./tags.js";

const cwd = process.cwd();

/**
 * @param {{dev:object,build:object,config:object,}} data
 * @param {(engine:import("liquidjs").Liquid)=>void} [load]
 * @returns {import("vite").Plugin}
 */
export default function plugin({ dev, build, config, ...data } = {}, load) {
    let isServer;
    let vite = {};
    const engine = new Liquid({
        cache: true,
        dynamicPartials: false,
    });

    load && load(engine);

    Object.entries(tags).forEach(([tag, plugin]) =>
        engine.registerTag(tag, plugin)
    );

    return {
        name: "plugin-liquidjs",
        configResolved({ base, root, build }) {
            const outDir = path.resolve(cwd, root) + "/" + build.outDir;
            Object.assign(vite, { base, root, outDir });
            return config;
        },
        configureServer() {
            isServer = true;
        },
        transformIndexHtml(html, chunk) {
            return engine.parseAndRender(
                html,
                {
                    ...data,
                    ...(isServer ? dev : build),
                    vite: {
                        ...vite,
                        isServer,
                    },
                    __path: chunk.path,
                    __filename: chunk.filename,
                },
                {
                    root: vite.root,
                }
            );
        },
    };
}
