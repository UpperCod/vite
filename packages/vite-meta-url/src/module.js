import path from "path";
import { readFile } from "fs/promises";
import { replaceImport } from "@uppercod/replace-import";

/**
 * @param {Files} files
 * @returns {import("vite").Plugin}
 */
export default function pluginReplaceImport(files) {
    let isServer;
    let sources = {};
    const ext = Object.keys(files).filter((key) => files[key]);
    const filter = RegExp(`\\.(${ext.join("|")})$`);
    return {
        name: "plugin-meta-url",
        configureServer(server) {
            isServer = true;
            server.watcher.on("change", (path) => delete sources[path]);
        },
        transform(code, id) {
            if (!/node_modules/.test(id) && /\.([tj]s|[jt]sx)$/.test(id)) {
                const dir = path.dirname(id);
                return replaceImport({
                    code,
                    filter: (id) => filter.test(id),
                    replace: async (token) => {
                        const id = path.join(dir, token.src);

                        let source;

                        const { base, ext } = path.parse(id);
                        const type = ext.replace(".", "");

                        sources[id] =
                            sources[id] ||
                            Promise.resolve().then(async () => {
                                const src = path.join(dir, token.src);
                                let source;

                                if (typeof files[type] == "function") {
                                    source = await files[type](src);
                                } else if (!isServer) {
                                    source = await readFile(src);
                                }

                                return typeof source == "object" &&
                                    source.inline
                                    ? source
                                    : {
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

                        token.toString = () =>
                            `const ${token.scope} = ${
                                source.inline
                                    ? `\`${source.inline}\``
                                    : isServer
                                    ? `new URL("${source.id}", import.meta.url).href`
                                    : `import.meta.ROLLUP_FILE_URL_${source.id}`
                            }`;

                        return token;
                    },
                });
            }
            return null;
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
 * @typedef {Object<string,boolean|(file:File)=>(Promise<string|Uint8Array|Inline>|string|Inline)} Files
 */
