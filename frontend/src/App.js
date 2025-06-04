import { RouterProvider } from 'react-router-dom';
import RouteConfig from './config/RouteConfig';
import { ToastContainer } from 'react-toastify';
import { Loader } from './shared/Loader';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

function App() {
    const router = RouteConfig();
    const isFetching = useIsFetching({
        predicate: (query) =>
            query.queryKey[0] !== 'getNotificationsLists' &&
            query.queryKey[0] !== 'getOrganizationLists',
    });
    const isMutating = useIsMutating();
    const isLoading = isFetching > 0 || isMutating > 0;

    return (
        <>
            <ToastContainer />
            {isLoading && <Loader />}

            <RouterProvider router={router} />
        </>
    );
}

export default App;
