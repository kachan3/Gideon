export const fileURLToPath=url=>decodeURIComponent(new URL(url).pathname);
export const pathToFileURL=path=>new URL('file://'+path);
