import * as CryptoJS from 'crypto-js';
const useDecrypt = (data) => {
    const secretKey = process.env.REACT_APP_Encrypt_SECRET_KEY || '';
    if (!data || !secretKey) {
        console.log('Missing encrypted data or secret key', data, secretKey);
        return null;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(data, secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) return null; // Return null if decryption fails

        // Try parsing JSON (if it's a stringified object)
        try {
            return JSON.parse(decryptedString);
        } catch {
            // If JSON parsing fails, return as-is
            return isNaN(decryptedString) ? decryptedString.toLowerCase() : Number(decryptedString);
        }
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

export default useDecrypt;
