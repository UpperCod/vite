# @uppercod/vite-meta-url-load-css

css loader for plugins @uppercod/vite-meta-url

## Example

### Config

```js
import pluginMetaUrl from "@uppercod/vite-meta-url";
import loadCss from "@uppercod/vite-meta-url-load-css";

export default {
    build: {
        target: "esnext",
    },
    plugins: [
        pluginFileUrl({
            css: loadCss(),
        }),
    ],
};
```
