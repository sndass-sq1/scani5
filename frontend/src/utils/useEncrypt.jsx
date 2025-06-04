import * as CryptoJS from 'crypto-js';

export const useEncrypt = () => {
    const secretkey = process.env.REACT_APP_Encrypt_SECRET_KEY || '';
    const encrypt = (data) => {
        // return CryptoJS.AES.encrypt(String(data), secretkey).toString(); // Convert to string
        if (!data || !secretkey) {
            console.error('Missing data or secret key');
            return null;
        }

        try {
            // Convert numbers and objects to a string
            const stringData = typeof data === 'object' ? JSON.stringify(data) : String(data);
            return CryptoJS.AES.encrypt(stringData, secretkey).toString();
        } catch (error) {
            console.error('Encryption failed:', error);
            return null;
        }
    };

    return encrypt;
};
