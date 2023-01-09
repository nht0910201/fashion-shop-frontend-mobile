import { createSlice } from "@reduxjs/toolkit";
import { clearToken, storeToken } from "../utils/tokenHandle";
import { clearUser, storeUser } from "../utils/userHandle";

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:{
            email:"",
            name:"",
            avatar:"",
            role:"",
            accessToken:""
        }
    },
    reducers:{
        login(state,action){
            const {id,email,name,avatar,role,accessToken} = action.payload.data
            storeToken(accessToken)
            storeUser(id,email,name,avatar,role)
        },
        logout(state,action){
            clearToken()
            clearUser()
        }
    }
})
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;