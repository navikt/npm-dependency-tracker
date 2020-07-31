require('dotenv').config();
import * as util from './util';
import execute from './crawler';

console.time(util.finished);
util.checkEnv();
execute()
.then(() => console.timeEnd(util.finished));
