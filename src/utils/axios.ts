import axios from "axios";
import { getTokenCustom } from "@/actions";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
})

const createAuthInstance = async () => {
    try {
        const token = await getTokenCustom();
        return axios.create({
            baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Error getting token:', error);
        throw error
    }
};

export const getAxiosInstance = async () => {
    return await createAuthInstance()
};