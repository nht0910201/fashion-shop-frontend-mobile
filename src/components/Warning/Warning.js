import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export const Warning = (title,msg) => {
    Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: title,
        textBody: msg,
        button: 'Đóng',
    })
}