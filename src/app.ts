import rp from 'request-promise';
import Fastify from 'fastify';
import * as fs from 'promise-fs';
import path from 'path';
import { Util } from './util';
import { getLogger } from './logger/logger';

const fastify = Fastify();
const logger = getLogger("ResourceServer");

(async () => {
    const nativeUrl = 'http://146.59.110.103';
    const localesPath = path.resolve(__dirname, '../resources/locales');
    const resourcesPath = path.resolve(__dirname, '../resources/resources');

    logger.info('Configuration:');
    logger.info('  Locales At: {0}', localesPath);
    logger.info('  Resources At: {0}', resourcesPath);

    fastify.get<{ Params: { lang: string; }}>('/localized.data_:lang', async (req, res) => {
        const lang = req.params['lang'];
        const file = path.join(localesPath, 'localized.data_' + lang);

        const data = await fs.readFile(file, { encoding: null });
        logger.info('Sending locale: {0}', file);

        res.send(data);
    });

    fastify.get<{ Params: {
        a: string;
        b: string;
        c: string;
        d: string;
        version: string;
        file: string;
    } }>('/:a/:b/:c/:d/:version/:file', async (req, res) => {
        const a = req.params['a'];
        const b = req.params['b'];
        const c = req.params['c'];
        const d = req.params['d'];

        const resourceId = Util.decode(a, b, c, d);
        const version = req.params['version'];
        const file = req.params['file'];

        const filePath = path.join(resourcesPath, String(resourceId), version, file);

        if(await Util.checkFileExists(filePath)) {
            logger.info('Found cached resource {0}', resourceId + ':' + version);
            const data = await fs.readFile(filePath, { encoding: null });
            res.send(data);
        } else {
            logger.info('Downloading resource: {0}', resourceId + ':' + version);
            try {
                const data = await rp(nativeUrl + `/${a}/${b}/${c}/${d}/${version}/${file}`, {
                    encoding: null
                });

                await Util.mkdirs(resourcesPath, `${resourceId}/${version}`);
                await fs.writeFile(filePath, data, { encoding: null });

                res.send(data);
            } catch (e) {
                logger.error('  Failed to download resource {0}: {1}', resourceId + ':' + version, (e as any).toString());
                res.status(404).send('404 - Not Found');
            }
        }
    });

    await fastify.listen({
        path: '/',
        host: '0.0.0.0',
        port: 2023
    });

    logger.info('Listening on port {0}', 2023);
})();