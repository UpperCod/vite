import path from "path";
import { readFile } from "fs/promises";
import { replaceImport } from "@uppercod/replace-import";
import { hash } from "@uppercod/hash";
import { mapHtmlAttrs, copy } from "./utils.js";

const cwd = process.cwd();

/**
 * @param {Files} files
 * @returns {import("vite").Plugin}
 */
export default function pluginReplaceImport(files) {
    let isServer;
    let sources = {};
    let outDir;
    let mark = "";
    const ext = Object.keys(files).filter((key) => files[key]);
    const filter = RegExp(`\\.(${ext.join("|")})$`);
    const virtualModuleNamespace = `\0vite-meta-url/`;
    const virtualModule = {};
    const { normalize } = path;
    const importers = {};
    return {
        name: "plugin-meta-url",
        configResolved(config) {
            outDir = path.resolve(cwd, config.root) + "/" + config.build.outDir;
            return config;
        },
        configureServer(server) {
            isServer = true;
            server.watcher.on("change", function cleanSources(id) {
                id = normalize(id);
                const importer = importers[id];
                if (importer) {
                    [...importer].forEach(cleanSources);
                    delete importers[id];
                } else if (sources[id]) {
                    mark = Date.now();
                    delete sources[id];
                }
            });
        },
        async transformIndexHtml(html, chunk) {
            if (!isServer) {
                const task = [];
                html = mapHtmlAttrs(html, (value) => {
                    const { ext, name } = path.parse(value);
                    const type = ext.replace(".", "");
                    if (!files[type] || /assets\/\S+\.\w+$/.test(value))
                        return value;

                    const id = path.join(
                        path.relative(
                            cwd,
                            path.join(path.dirname(chunk.filename), value)
                        )
                    );

                    const fileName = "-/" + name + "-" + hash(id) + ext;

                    task.push(copy(id, outDir + "/" + fileName));

                    const url = "/" + fileName;

                    return url;
                });

                await Promise.all(task);
            }
            return html;
        },
        transform(code, id) {
            id = normalize(id);
            if (!/node_modules/.test(id) && /\.([tj]s|[jt]sx)$/.test(id)) {
                const dir = path.dirname(id);
                importers[id] = importers[id] || new Set();
                const importer = importers[id];
                return replaceImport({
                    code,
                    filter: (id) => filter.test(id),
                    replace: async (token) => {
                        const id = path.join(dir, token.src);

                        let source;

                        const { base, ext } = path.parse(id);
                        const type = ext.replace(".", "");

                        this.addWatchFile(id);

                        importer.add(id);

                        sources[id] =
                            sources[id] ||
                            Promise.resolve().then(async () => {
                                const src = path.join(dir, token.src);
                                let source;

                                if (typeof files[type] == "function") {
                                    source = await files[type](src, isServer);
                                } else if (!isServer) {
                                    source = await readFile(src);
                                }

                                return typeof source == "object" &&
                                    source.inline
                                    ? { ...source, src }
                                    : {
                                          src,
                                          id: isServer
                                              ? token.src
                                              : this.emitFile({
                                                    name: base,
                                                    type: "asset",
                                                    source,
                                                }),
                                      };
                            });

                        source = await sources[id];

                        token.toString = () => {
                            if (source.module) {
                                const id = hash(source.src) + mark;
                                virtualModule[id] = source;
                                return `${token.type} ${token.scope} from "${
                                    virtualModuleNamespace + id
                                }"`;
                            }
                            const code = `${
                                token.scope ? `const ${token.scope} =` : ""
                            } ${
                                source.inline
                                    ? source.inline
                                    : isServer
                                    ? `new URL("${source.id}", import.meta.url).href`
                                    : `import.meta.ROLLUP_FILE_URL_${source.id}`
                            }`;
                            return token.dinamic
                                ? `Promise.resolve(${code})`
                                : code;
                        };

                        return token;
                    },
                });
            }
            return null;
        },
        resolveId(id) {
            if (!id.indexOf(virtualModuleNamespace)) {
                return id;
            }
        },
        load(id) {
            if (!id.indexOf(virtualModuleNamespace)) {
                const [, partId] = id.split("/");
                return virtualModule[partId].inline;
            }
        },
    };
}

/**
 *
 * @typedef {Object} File
 * @property {string} id
 * @property {string} src
 * @property {string} type
 * @property {string} dest
 */

/**
 * @typedef {{inline:string}} Inline
 */

/**
 * @typedef {Object<string,boolean|(file: File, isServer: boolean)=>(Promise<string|Uint8Array|Inline>|string|Inline)} Files
 */
