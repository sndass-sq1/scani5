import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/util.css';
import './styles/login.css';
import './index.css';
import './App.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
// import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './errors/ErrorBoundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <App />
                <ReactQueryDevtools initialIsOpen />
            </ErrorBoundary>
        </QueryClientProvider>
    </React.StrictMode>
);
