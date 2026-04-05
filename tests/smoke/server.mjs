import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const publicRoot = fileURLToPath(new URL("../../public", import.meta.url));
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

const resolvePath = (pathname) => {
  const requestPath = decodeURIComponent(pathname);
  const normalized = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const safePath = normalized.replace(/^[/\\]+/, "");
  let resolvedPath = join(publicRoot, safePath);

  if (requestPath.endsWith("/")) {
    resolvedPath = join(resolvedPath, "index.html");
  } else if (!extname(requestPath)) {
    const nestedIndex = join(resolvedPath, "index.html");
    if (existsSync(nestedIndex)) {
      resolvedPath = nestedIndex;
    }
  }

  return resolvedPath;
};

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
  const filePath = resolvePath(requestUrl.pathname);

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      throw new Error("Not a file");
    }

    const type = contentTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1");

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
