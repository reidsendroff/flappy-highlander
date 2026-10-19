import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve('dist');
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be a valid TCP port.');
}

function resolveRequestPath(url = '/') {
  try {
    const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
    const relative = normalize(pathname).replace(/^([/\\])+/, '');
    const candidate = resolve(root, relative || 'index.html');
    if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return null;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    return join(root, 'index.html');
  } catch {
    return null;
  }
}

const server = createServer((request, response) => {
  const file = resolveRequestPath(request.url);
  if (!file || !existsSync(file)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'cache-control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
    'content-type': contentTypes[extname(file)] ?? 'application/octet-stream',
    'x-content-type-options': 'nosniff',
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(file).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Flappy Highlander listening on port ${port}`);
});
