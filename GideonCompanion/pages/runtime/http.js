// No HTTP server: dispatch the same API operations in this browser.
export const createServer=handler=>({handle:handler});
