const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 5500);
const ROOT = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolvePath(urlPath) {
  const normalizedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = normalizedPath === "/" ? "/index.html" : normalizedPath;
  const absolutePath = path.join(ROOT, requestedPath);
  const relativePath = path.relative(ROOT, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return absolutePath;
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        fs.readFile(path.join(ROOT, "index.html"), (indexError, indexContent) => {
          if (indexError) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("No se pudo cargar index.html");
            return;
          }

          res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
          res.end(indexContent);
        });
        return;
      }

      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error interno al servir archivos");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const targetPath = resolvePath(req.url || "/");

  if (!targetPath) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Ruta invalida");
    return;
  }

  fs.stat(targetPath, (error, stats) => {
    if (!error && stats.isDirectory()) {
      sendFile(res, path.join(targetPath, "index.html"));
      return;
    }

    sendFile(res, targetPath);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Proodos FE disponible en http://localhost:${PORT}`);
  console.log(`Proodos FE tambien escucha en http://127.0.0.1:${PORT} y en la IP local de la maquina`);
});
