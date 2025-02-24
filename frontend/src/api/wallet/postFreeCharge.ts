import {axiosInstance} from "@/api";

export async function postFreeCharge() {
    const response = await axiosInstance.post('/api/users/wallet/charge/free')
    return response.data
}