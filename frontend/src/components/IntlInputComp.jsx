import React, { useState } from 'react';
import ReactIntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

const PhoneInput = () => {
    const [phone, setPhone] = useState('');

    const handlePhoneChange = (isValid, value, countryData) => {
        setPhone(value);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <ReactIntlTelInput
                preferredCountries={['us', 'gb', 'in']}
                defaultCountry="in"
                onPhoneNumberChange={handlePhoneChange}
                separateDialCode
            />
        </div>
    );
};

export default PhoneInput;
