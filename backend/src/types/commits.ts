declare module CommitData {
    export interface FilePaths {
        path?: string;
        oldPath?: string;
        newPath?: string;
    }

    export interface Root {
        hash: string;
        authorName: string;
        authorEmail: string;
        date: string;
        message: string;
        filesAdded: FilePaths[];
        filesDeleted: FilePaths[];
        filesModified: FilePaths[];
        filesRenamed: FilePaths[];
        diffs: any[];
    }
}

export default CommitData;
