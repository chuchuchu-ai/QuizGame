import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

// GitHub Pages처럼 /QuizGame/ 아래에서 완성된 dist 파일만 제공합니다.
// 개발 서버의 자동 경로 보정 없이도 배포용 파일이 실행되는지 검사합니다.
const root = resolve('dist');
const prefix = '/QuizGame/';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix)) { response.writeHead(404).end(); return; }
    const file = resolve(root, pathname.slice(prefix.length) || 'index.html');
    // 요청 경로가 프로젝트의 배포 폴더 밖을 가리키면 파일을 읽지 않습니다.
    if (!file.startsWith(root + sep)) { response.writeHead(404).end(); return; }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(content);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4174, '127.0.0.1');
