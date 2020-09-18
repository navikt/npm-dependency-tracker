declare module CommitData {
    interface FilePaths {
        path?: string;
        oldPath?: string;
        newPath?: string;
    }
    interface Root {
        hash: string;
        authorName: string;
        authorEmail: string;
        date: string;
        message: string;
        filesAdded: FilePaths[];
        filesDeleted: FilePaths[];
        filesModified: FilePaths[];
        filesRenamed: FilePaths[];
        packages: any[];
    }
}
export default CommitData;
