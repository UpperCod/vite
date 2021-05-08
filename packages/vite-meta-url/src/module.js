import path from "path";
import { readFile } from "fs/promises";
import { replaceImport } from "@uppercod/replace-import";

/**
 * @param {Object<string,boolean|(file:File)=>(Promise<string>|string)} files
 * @returns {import("vite").Plugin}
 */
export default function pluginMetaUrl(files) {
    let isServer;
    let ready = {};
    const ext = Object.keys(files).filter((key) => files[key]);
    const filter = RegExp(`\\.(${ext.join("|")})$`);
    return {
        name: "plugin-css",
        configResolved(resolvedConfig) {
            // store the resolved config
            isServer = resolvedConfig.command == "serve";
        },
        async transform(code, id) {
            if (/\.([tj]s|[jt]sx)$/.test(id)) {
                const dir = path.dirname(id);
                return replaceImport({
                    code,
                    filter: (id) => filter.test(id),
                    replace: async (token) => {
                        const id = path.join(dir, token.src);

                        let referenceId;

                        if (!isServer) {
                            const { base, ext } = path.parse(id);
                            const type = ext.replace(".", "");
                            ready[id] =
                                ready[id] ||
                                Promise.resolve().then(async () =>
                                    this.emitFile({
                                        name: base,
                                        type: "asset",
                                        source: await (typeof files[type] ==
                                            "function"
                                            ? files[type]
                                            : readFile)(
                                            path.join(dir, token.src)
                                        ),
                                    })
                                );

                            referenceId = await ready[id];
                        }

                        token.toString = () =>
                            `const ${token.scope} = ${
                                isServer
                                    ? `new URL("${token.src}", import.meta.url).href`
                                    : `(import.meta.ROLLUP_FILE_URL_${referenceId})`
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
