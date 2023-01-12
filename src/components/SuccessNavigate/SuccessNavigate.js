import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export const SuccessNavigate = (title,msg,navigation,screen) => {
    Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: title,
        textBody: msg,
        button: 'OK',
        onPressButton: () => {navigation.navigate(screen)}
    })
}