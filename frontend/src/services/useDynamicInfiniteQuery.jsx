import { useInfiniteQuery } from '@tanstack/react-query';
import useFetchAPI from './useFetchAPI';

export default function useDynamicInfiniteQuery(config = {}) {
    const fetchAPI = useFetchAPI();

    const getPageNumber = (link, type) => {
        const result = !!link ? Number(link?.split('=')[1]) : null;
        return result;
    };

    const infiniteQuery = useInfiniteQuery({
        queryKey: config?.params
            ? [`${config?.query_name}`, config?.params]
            : [`${config?.query_name}`],
        queryFn:
            // fetchAPI(),
            ({ pageParam }) => fetchAPI({ pageParam }, config),
        initialPageParam: 1,
        enabled: config.type === 'get' && config?.query_type === 'infinite',
        getNextPageParam: (data) => {
            const nextPageUrl = data?.data?.next_page_url;
            return nextPageUrl ? getPageNumber(nextPageUrl, 'next') : undefined;
        },
        getPreviousPageParam: (data) => {
            const prevPageUrl = data?.data?.prev_page_url;
            return prevPageUrl ? getPageNumber(prevPageUrl, 'prev') : undefined;
        },
        maxPages: 3
    });

    return infiniteQuery;
}
