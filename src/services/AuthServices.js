import { post } from "../api/axiosConfig";


export const userLogin = async (data={}) =>{
    try {
        const response = await post('/auth/login',data);
        return response
    } catch (error) { 
        return error.response
    };
}