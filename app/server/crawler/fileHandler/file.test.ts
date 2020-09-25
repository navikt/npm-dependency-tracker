import * as file from './file';

describe('filehandler', () => {
    describe('file.ts', () => {
        it('Should read JSON from filesystem', () => {
            expect(
                file.filereadJson('app/server/crawler/__mock__/mockdata.json')
            ).toEqual(['item', 'item', 'item']);
        });

        it('Should not find file from filesystem and throw error', () => {
            expect(() =>
                file.filereadJson('this/file/does/not/exist.json')
            ).toThrow();
        });

        it('Should write data to filesystem', () => {
            let foo = { bar: {} };
            foo.bar = foo;
            expect(() =>
                file.writeData(
                    foo,
                    'app/server/crawler/__mock__/files-written-for-tests',
                    'writeDataTestFile.json'
                )
            ).toThrow();
        });

        it('Should write then read data from filesystem', () => {
            let dir = 'app/server/crawler/__mock__/files-written-for-tests';
            let filename = 'writeReadTestfile.json';
            file.writeData(['data1', 'data2'], dir, filename);

            expect(file.filereadJson(`${dir}/${filename}`)).toEqual([
                'data1',
                'data2'
            ]);
        });
    });
});
