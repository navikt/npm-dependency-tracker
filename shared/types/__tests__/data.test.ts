import { RepoResult, RepoResultFactory, Repo } from '../../index';
import { repo } from './mockData';
describe('Shared', () => {
    describe('Data.ts', () => {
        it('Should create valid RepoResult object', () => {
            let rep = repo;
            let res = RepoResultFactory(repo);
            //expect();
        });
    });
});
