import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: process.env.REACT_APP_Echo_Broad_Caster,
    key: process.env.REACT_APP_Echo_KEY,
    wsHost: process.env.REACT_APP_Echo_wsHost,
    wsPort: process.env.REACT_APP_Echo_wsPort,
    wssPort: process.env.REACT_APP_Echo_wssPort,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    // authEndpoint: '/broadcasting/auth',
    // auth: {
    //     headers: {
    //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    //     },
    // },
});

export default window.Echo;
