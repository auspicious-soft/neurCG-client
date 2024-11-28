import { getAxiosInstance } from "@/utils/axios";
import { axiosInstance } from "@/utils/axios"

export const loginService = async (payload: any) => await axiosInstance.post(`/user/login`, payload)
export const signupService = async (payload: any) => await axiosInstance.post(`/user/signup`, payload)
export const forgotPasswordEmailSentService = async (payload: any) => await axiosInstance.patch(`/user/forgot-password`, payload)
export const sendOtpService = async (payload: any) => await axiosInstance.post(`/user/verify-otp`, payload)
export const updatePasswordServiceAfterOtpVerified = async (payload: any) => await axiosInstance.patch(`/user/new-password-otp-verified`, payload)


export const getUserNotifications = async (id: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(id);
}

export const getUserInfo = async (id: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(id);
}

export const updateUserInfo = async (id: string, formData: any) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(id, formData);
}

export const getAvatars = async (route: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const getUserProjects = async (route: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const deleteProject = async (route: string) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.delete(route)
}

export const convertTextToVideo = async (id: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(id, payload)
}

export const convertAudioToVideo = async (id: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(id, payload)
}

export const translateVideo = async (id: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(id, payload)
}

export const buyPlan = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route, payload);
}

export const cancelSubscription = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.patch(route, payload)
}