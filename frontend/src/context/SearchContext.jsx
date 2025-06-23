import { createContext, use, useState } from 'react';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

    return (
        <SearchContext value={{ debouncedSearchValue, setDebouncedSearchValue }}>
            {children}
        </SearchContext>
    );
};

export const useSearch = () => {
    return use(SearchContext);
};
