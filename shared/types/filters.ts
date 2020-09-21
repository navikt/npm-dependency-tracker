export type NameFilter = {
    name: string;
    sortby: string;
    withWebsite: boolean;
    isPrivate: boolean;
    isArchived: boolean;
};

export type PackFilter = {
    name: string;
    version: string;
    timeline: string;
    key: string;
};

export type RootFilter = {
    nameFilter: NameFilter;
    packFilter: PackFilter[];
    preset: string;
};
