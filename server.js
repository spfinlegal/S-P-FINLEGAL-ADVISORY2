const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

const server = http.createServer((req, res) => {
    let cleanUrl = decodeURIComponent(req.url.split('?')[0]);
    if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';

    let filePath = path.normalize(path.join(BASE_DIR, cleanUrl));

    // Safety: stay inside the site folder and never serve build tooling
    const rel = path.relative(BASE_DIR, filePath);
    if (rel.startsWith('..') || /^(tools|node_modules)([\\/]|$)/.test(rel)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>404 Not Found</h1>');
    }

    if (!path.extname(filePath) && !fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath += '.html';
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 Not Found</h1><p>Requested file does not exist.</p>');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const etag = `W/"${stats.size}-${stats.mtimeMs}"`;
        const headers = {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'ETag': etag,
            'Vary': 'Accept-Encoding',
            // HTML always revalidates; static assets are cached briefly and revalidated with ETag
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600, must-revalidate'
        };

        if (req.headers['if-none-match'] === etag) {
            res.writeHead(304, headers);
            return res.end();
        }

        const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
        const stream = fs.createReadStream(filePath);
        if (acceptsGzip && COMPRESSIBLE.has(ext)) {
            headers['Content-Encoding'] = 'gzip';
            res.writeHead(200, headers);
            stream.pipe(zlib.createGzip({ level: 6 })).pipe(res);
        } else {
            headers['Content-Length'] = stats.size;
            res.writeHead(200, headers);
            stream.pipe(res);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Local development server running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${BASE_DIR}`);
});
