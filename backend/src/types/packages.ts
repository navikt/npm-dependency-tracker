interface Package {
    lastCommit: string;
    cloneUrl: string;

}
function Package(lastCommit:string = '', cloneUrl:string = ''):Package {
    return {lastCommit: lastCommit, cloneUrl:cloneUrl}
}

namespace Package {
	export const of = (Package: Partial<Package>) => {
		return;
    }
    export const of2 = (Package: Partial<Package>) => {
		return;
	}
}

export default Package;
