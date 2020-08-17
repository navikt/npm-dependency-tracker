
export enum FilterType {
    ACTIVITY,
    DEPPRESET,
    DEPNAME
}

export enum VersionScope {
    UP,
    DOWN,
    SPESIFIC
}

export enum ActivityRange {
    ONE,
    THREE,
    SIX,
    YEAR,
    ALL
}

export enum InputState {
    ADD,
    REMOVE,
    OFF
}

export enum BoolOperators {
    AND,
    OR,
    NOT
}



export type SelectedData = {
    type: FilterType;
    value: string | ActivityRange;
    state?: InputState
}

export type DepNameData = {
    name: string;
    version: string;
    scope: VersionScope;
    operator?: BoolOperators;
}

export type FilterData = {
    activity: SelectedData;
    preset: SelectedData[];
    depFilters: DepNameData[];
}

export type Stats = {
    name: string;
    data: any;
}