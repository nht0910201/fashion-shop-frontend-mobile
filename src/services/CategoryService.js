import { get } from "../api/axiosConfig";


export const getAllCategory = async (root=true) =>{
    try {
        const response = await get(`/categories?root=${root}`);
        return response
    } catch (error) { console.log(error); };
}
