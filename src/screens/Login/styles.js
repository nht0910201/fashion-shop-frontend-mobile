import { StyleSheet } from "react-native";
import { gray, grayLight, primary, white } from "../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal:5,
        backgroundColor:white
    },
    wFull: {
        width: '100%',
    },
    header: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    content:{
        flex:3,
        justifyContent:'flex-start',
        // alignItems:'center'
    },
    other:{
        flex:3,
        justifyContent:'center',
        alignItems:'center',
        marginTop:4
    },
    loginContinueTxt: {
        fontSize: 28,
        textAlign: 'center',
        color: '#f5a524',
        fontWeight: 'bold',
    },
    
    // Login Btn Styles
    loginBtnWrapper: {
        height: 55,
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    forgotPassText: {
        fontSize:20,
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    signupBtn: {
        fontSize:20,
        color: '#f5a524',
        fontWeight: 'bold',
        marginTop:10
    },
    footerText:{
        fontSize:20,
        marginBottom:10,
        marginTop:10
    },
    button:{
        fontSize:16
    }
});