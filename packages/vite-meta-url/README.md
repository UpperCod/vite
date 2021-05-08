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

### index.js

```js
import styleUrl from "./style.css";

console.log(styleUrl);
```

the `css` files will be copied to the destination and the import will refer to the destination as an example url relative to the module.

## install

```
npm install@uppercod/esbuild-meta-url
```

## Options

```js
pluginFileUrl({
    css: true,
    /**
     * you can alternatively associate a callback to
     * modify the script manually, escaping from esbuild
     * @param {Object} File
     * @param {string} File.id - base of the file in destination
     * @param {string} File.src - source of file on disk
     * @param {string} File.type - file type
     * @param {string} File.dest - file write destination
     * @returns {string}
     */
    md: ({ id, type, src, dest }) => {
        // The id will be the reference to use for the URL,
        // it is mandatory to return this
        return id;
    },
});
```

> This plugin does not break with other plugins, it generates sub-instances of esbuild to process the files if any plugin requires it. these sub-instances will inherit the settings
