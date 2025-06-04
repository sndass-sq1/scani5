export const removeUnderscore = (val = '') => {
    if (val && val.length > 0) {
        return val.split('_').join(' ');
    }
};
