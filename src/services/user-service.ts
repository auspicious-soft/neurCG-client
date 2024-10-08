import { getAxiosInstance } from "@/utils/axios";
import { axiosInstance } from "@/utils/axios"

export const loginService = async (payload: any) => await axiosInstance.post(`/user/login`, payload)
export const signupService = async (payload: any) => await axiosInstance.post(`/user/signup`, payload)


export const getUserNotifications = async (id: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(id);
}

export const getUserInfo = async (id: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(id);
}