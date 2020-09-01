export enum DiffType {
    ADD,
    REMOVE
}

interface Package {
    date: number;
    name: string;
    version: string;
    type: DiffType;
    hash: string;
}
function Package(
    date: number = 0,
    name: string = '',
    version: string = '',
    type: DiffType.ADD,
    hash: string = ''
): Package {
    return { date: date, name: name, version: version, type: type, hash: hash };
}

namespace Package {
    export const of = (Package: Partial<Package>) => {
        return;
    };
    export const of2 = (Package: Partial<Package>) => {
        return;
    };
}

export default Package;
