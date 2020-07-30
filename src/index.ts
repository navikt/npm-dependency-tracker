require('dotenv').config();
import * as util from './util';
import execute from './crawler';

// TODO: Handle erros better, try to rerun them at the end?
console.time(util.finished);
util.checkEnv();
execute().then(() => console.timeEnd(util.finished));
