import useAPIClient from './useAPIClient';

const useFetchAPI = () => {
    const apiClient = useAPIClient();

    const fetch = async (params = {}, config = {}) => {
        try {
            const finalParams = () => {
                if (config?.type === 'get') {
                    if (config?.query_type === 'infinite') {
                        return { page: params?.pageParam, ...config.params };
                    } else if (config?.query_type === 'queries') {
                        return params.params;
                    } else {
                        return config?.params;
                    }
                } else {
                    return undefined;
                }
            };

            const final_url = () => {
                let url = config?.url;
                if (config?.type === 'get') {
                    if (config?.query_type === 'queries') {
                        url = params?.url;
                    }
                }
                return url;
            };

            const response = await apiClient.request({
                url: final_url(),
                method: config?.type,
                params: finalParams(),
                ...(config?.responseType && { responseType: config?.responseType }),
                data: config?.type !== 'get' ? params : undefined,
                ...('header' in config && {
                    headers: {
                        ...config.header,
                    },
                }),
            });

            return response.data || {};
        } catch (err) {
            console.error('Fetch error:', err);
            throw err;
        }
    };

    return fetch;
};

export default useFetchAPI;
