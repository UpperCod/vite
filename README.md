# @uppercod/vite-\*

monorepo of plugins created by @uppercod for vite:

### [@uppercod/vite-meta-url](./packages/vite-meta-url/README.md)

replace imports of imported js files within vite, by URL based imports or inline content

```js
import path from "path";
import pluginMetaUrl from "@uppercod/vite-meta-url";

/**
 * @type {import("vite").UserConfig}
 */
const config = {
    build: {
        target: "esnext",
    },
    plugins: [
        pluginMetaUrl({
            svg: true,
            async css() {
                return { inline: ".my-css{color:red}" };
            },
        }),
    ],
};

export default config;
```
