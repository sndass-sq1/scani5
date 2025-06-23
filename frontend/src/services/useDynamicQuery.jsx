import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueries,
    useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useFetchAPI from './useFetchAPI';
import { useMemo, useState } from 'react';

export default function useDynamicQuery(config = {}) {
    const queryClient = useQueryClient();
    const fetch = useFetchAPI();
    const [queries, setQueries] = useState([]);
    const getQueries = useMemo(() => {
        if (config?.queries?.length > 0) {
            return config?.queries
                ?.map((val) => {
                    return {
                        queryKey: val?.params
                            ? [`${val?.query_name}`, val?.params]
                            : [`${val?.query_name}`],
                        queryFn: () => fetch(val, config),
                        enabled: !!val?.url,
                        staleTime: 30000,
                        cacheTime: 1000 * 60 * 15, // 10 minutes,
                        placeholderData: keepPreviousData,
                    };
                })
                .filter(Boolean);
        }
    }, [config?.queries]);

    useMemo(() => {
        if (getQueries?.length > 0) {
            setQueries(getQueries);
        }
    }, [getQueries]);

    const queriesResults = useQueries({ queries });

    const queryResult = useQuery({
        queryKey: config?.params
            ? [`${config?.query_name}`, config?.params]
            : [`${config?.query_name}`],
        queryFn: () => fetch({}, config),
        placeholderData: keepPreviousData,
        staleTime: config?.staleTime ?? 30000,
        cacheTime: config?.cacheTime ?? 1000 * 60 * 15, // 10 minutes,
        refetchOnWindowFocus: config?.refetchOnWindowFocus ?? true,
        enabled:
            config.type === 'get' &&
            config?.url !== '' &&
            config?.url !== undefined &&
            config?.query_name !== '' &&
            config?.query_name !== undefined &&
            config?.query_type !== 'queries' &&
            ('enabled' in config ? !!config?.enabled : true),
        retry: 0,
    });

    const mutationResult = useMutation({
        mutationFn: (params) => fetch(params, config),
        ...(config?.mutationKey && {
            mutationKey: config?.mutationKey,
        }),
        // throwOnError: true,
        onSuccess: (data) => {
            toast.success(data.message);
            try {
                if (config?.invalidateQuery?.length > 0) {
                    config?.invalidateQuery?.forEach((query) => {
                        queryClient.invalidateQueries({
                            queryKey: [`${query}`],
                        });
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },
        retry: 0,
    });

    return config.type === 'get'
        ? config?.queries?.length > 0
            ? queriesResults
            : queryResult
        : mutationResult;
}
