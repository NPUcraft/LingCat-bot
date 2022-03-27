import { dirname } from 'path';

function __dirname(importMetaUrl = import.meta.url) {
    return dirname(new URL(importMetaUrl).pathname.slice(1));
}

export default __dirname;