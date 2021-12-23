import { readFile } from "fs/promises";
import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssLoadConfig from "postcss-load-config";
import csso from "csso";

let currentConfig;

/**
 *
 * @param {string} cssText
 */
const defaultWrapper = (cssText) =>
    `_css\`${cssText.replace(/`/g, "\\`").replace(/${/g, "\\${")}\``;

export default (wrapper = defaultWrapper) =>
    async (src, server) => {
        const postcssConfig = {
            from: src,
            map: false,
        };

        currentConfig =
            currentConfig ||
            postcssLoadConfig(postcssConfig).catch(() => ({
                plugins: [],
            }));

        const { plugins } = await currentConfig;

        const { css } = await postcss([postcssImport(), ...plugins]).process(
            await readFile(src),
            postcssConfig
        );

        const cssText = server ? css : csso.minify(css).css;

        return {
            inline: wrapper(cssText),
        };
    };
