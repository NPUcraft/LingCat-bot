import { dirname } from 'path';

function __dirname(importMetaUrl = import.meta.url) {

    return dirname(new URL(importMetaUrl).pathname.slice(
        process.platform == "win32" ? 1 : 0
    ));
}

export default __dirname;