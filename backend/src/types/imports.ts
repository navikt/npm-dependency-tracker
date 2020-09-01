interface Imports {
    lastCommit: string;
    cloneUrl: string;

}
function Imports(lastCommit:string = '', cloneUrl:string = ''):Imports {
    return {lastCommit: lastCommit, cloneUrl:cloneUrl}
}

namespace Imports {
	export const of = (Imports: Partial<Imports>) => {
		return;
    }
    export const of2 = (Imports: Partial<Imports>) => {
		return;
	}
}

export default Imports;