import NameFilter from './nameFilter';
import PackFilter from './packFilter';

type RootFilter = {
    nameFilter: NameFilter;
    packFilter: PackFilter[];
    preset: string;
};

export default RootFilter;
