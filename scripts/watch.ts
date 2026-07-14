import {createServer, createLogger, build} from 'vite';
import type { LogLevel } from 'vite';
import { buildOCIArchive } from '@kube-hive/oci-artifact';
import { join } from 'node:path';

const LOG_LEVEL: LogLevel = 'info';

export async function main(): Promise<void> {
  const logger = createLogger(LOG_LEVEL, {
    prefix: '[main]',
  });

  const token = process.env.VITE_SERVER_AUTH_TOKEN;
  if(!token) {
    logger.warn('VITE_SERVER_AUTH_TOKEN is not set, endpoint will be open to everyone.');
  }

  const server = await createServer({
    server: {
      port: Number(process.env.VITE_SERVER_PORT) ?? 5173,
      allowedHosts: process.env.ORIGIN ? [process.env.ORIGIN] : [],
      host: '0.0.0.0',
    },
    plugins: [{
      name: 'build-endpoint',
      configureServer(server) {
        if(token) {
          server.middlewares.use((req, res, next) => {
            const token = process.env.VITE_SERVER_AUTH_TOKEN;
            if (token && req.headers.authorization !== token) {
              res.statusCode = 401;
              res.end('Unauthorized');
              return;
            }
            next();
          });
        }
        server.middlewares.use('/_build', (req, res, next) => {
          if(req.method !== 'GET') {
            next()
            return;
          }

          logger.info('Build triggered');
          build(server.config.inlineConfig)
              .then(() => buildOCIArchive({ inputDir: join(import.meta.dirname, '..', 'build') }))
              .then((tar) => {
                res.setHeader('Content-Type', 'application/x-tar');
                res.end(Buffer.from(tar));
              })
              .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.end(String(err));
              });
        });
      },
    }],
  });



  await server.listen();
  server.printUrls();
}

await main();
