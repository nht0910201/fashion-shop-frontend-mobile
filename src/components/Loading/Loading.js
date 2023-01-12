import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

function Loading({loading}) {
    return (
        <Spinner
            visible={loading}
            textContent={'Vui lòng chờ...'}
            color='#2F4F4F'
            animation='slide'
            size={'large'}
        />
    );
}

export default Loading;