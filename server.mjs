import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {extname, join} from "node:path";

const root = import.meta.dirname;
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

export function startServer({host = "127.0.0.1", port = 4173} = {}) {
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    const filename = pathname === "/" ? "index.html" : pathname.slice(1);
    if (request.method !== "GET" || filename.includes("..") || !contentTypes.has(extname(filename))) {
      response.writeHead(request.method === "GET" ? 404 : 405);
      response.end();
      return;
    }
    try {
      response.writeHead(200, {"Content-Type": contentTypes.get(extname(filename)), "Cache-Control": "no-store"});
      response.end(await readFile(join(root, filename)));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve(server));
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = Number.parseInt(process.env.PORT ?? "4173", 10);
  await startServer({host: "0.0.0.0", port});
  console.log(`[japan-mindmap] Preview available at http://127.0.0.1:${port}/`);
}