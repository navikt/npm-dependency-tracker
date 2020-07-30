import rimraf from 'rimraf';
import * as config from '../config';

export const deleteRepoDir = (fullName: string) => {
    rimraf.sync(config.tmpDirName + '/' + fullName);
}