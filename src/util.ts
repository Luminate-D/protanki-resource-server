import * as fs from 'promise-fs';
import path from 'path';

export class Util {
    public static encode(id: number): string {
        const _1 = (id & 0xff000000) >> 24;
        const _2 = (id & 0xff0000) >> 16;
        const _3 = (id & 0xff00) >> 8;
        const _4 = id & 0xff;

        return `${_1}/${_2}/${_3}/${_4}`;
    }

    public static decode(a: string, b: string, c: string, d: string): number {
        return (parseInt(a, 8) << 24) |
            (parseInt(b, 8) << 16) |
            (parseInt(c, 8) << 8) |
            parseInt(d, 8);
    }

    public static async mkdirs(basePath: string, dirsPath: string): Promise<void> {
        const dirs = dirsPath.split('/');
        let current = basePath;
        for(let i = 0; i < dirs.length; i++) {
            current += '/' + dirs[i];
            if(!await this.checkFileExists(current)) await fs.mkdir(current);
        }
    }

    public static checkFileExists(file: string): Promise<boolean> {
        return fs.promises.access(file, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false)
    }
}