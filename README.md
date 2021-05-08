# @uppercod/vite-\*

monorepo of plugins created by @uppercod for vite:

### [@uppercod/vite-meta-url](./packages/vite-meta-url/README.md)

replace imports of imported js files within vite, by URL based imports or inline content

```js
import pluginMetaUrl from "@uppercod/vite-meta-url";

export default {
    build: {
        target: "esnext",
    },
    plugins: [
        pluginFileUrl({
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
