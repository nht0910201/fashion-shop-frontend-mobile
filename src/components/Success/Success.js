import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export const Success = (title,msg) => {
    Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: title,
        textBody: msg,
        button: 'Đóng',
    })
}