# @uppercod/vite-meta-url

resolve a file using url.href in server or build mode when using vite

## Example

### Config

```js
import pluginMetaUrl from "@uppercod/vite-meta-url";

export default {
    build: {
        target: "esnext",
    },
    plugins: [
        pluginFileUrl({
            jpg: true,
            png: true,
            /**
             * replace the import with a text string based on the return
             * @param {string}
             * @returns {string|Promise<string>}
             */
            css: async (file) => {
                return { inline: `.button{color:red;}` };
            },
            /**
             * @param {string}  file
             * @returns {string|Promise<string>}
             */
            svg: async (file) => {
                /**any asynchronous optimization of the content**/
                return `<svg>...</svg>`;
            },
        }),
    ],
};
```
