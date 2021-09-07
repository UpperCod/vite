import { copy as copyFile } from "./utils.js";
import tag from "easy-tag-for-liquidjs";

const copy = tag({
    async render(context, file) {
        const { vite } = context;
        if (vite.isServer) return file;

        const id = path.join(
            path.relative(
                cwd,
                path.join(path.dirname(context.__filename), file)
            )
        );

        const idCopy = vite.outDir + "/" + id;
        const idDist = vite.base + id.replace(/\\/g, "/");

        await copyFile(id, idCopy);

        return idDist;
    },
});

export default { copy };
