import moment from 'moment';

export const FormatDate = (date) => {
    return moment(date).format('MMM DD, YYYY hh:mm:ss A');
};
