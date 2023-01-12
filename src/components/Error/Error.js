import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export const Error = (msg) => {
    Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Đã có lỗi xảy ra',
        textBody: msg,
        button: 'Đóng',
    })
}