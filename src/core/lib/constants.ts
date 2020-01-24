import { dirname, join } from "path";
import { readFileSync } from "fs";

export const ROOT_DIR = dirname(dirname(require.main.filename))
export const ASSETS_DIR = join(ROOT_DIR, 'assets')
export const PACKAGE:any = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), { encoding: 'utf8' }));
export const VERSION = PACKAGE.version+'-'+process.env.NODE_ENV;