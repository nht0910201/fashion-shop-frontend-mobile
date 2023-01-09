import { StyleSheet } from "react-native";
import { gray, grayLight, primary, white } from "../../constants/colors";

export const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        flex: 1,
        padding: 10,
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wFull: {
        flex:1,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    brandName: {
        fontSize: 42,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#f5a524',
        opacity: 0.9,
    },
    loginContinueTxt: {
        fontSize: 21,
        textAlign: 'center',
        color: gray,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    input: {
        // marginTop:10,
        // borderRadius: 5,
        // height: 45,
    },
    // Login Btn Styles
    loginBtnWrapper: {
        height: 55,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    linearGradient: {
        width: '100%',
        borderRadius: 50,
    },
    loginBtn: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 55,
    },
    loginText: {
        color: white,
        fontSize: 16,
        fontWeight: '400',
    },
    forgotPassText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 15,
    },
    // footer
    footer: {
        position: 'absolute',
        bottom:1,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: gray,
        fontWeight: 'bold',
    },
    signupBtn: {
        color: '#f5a524',
        fontWeight: 'bold',
    },
    // utils

    mr7: {
        marginRight: 7,
    },
});