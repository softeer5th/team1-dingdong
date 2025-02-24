import {axiosInstance} from "@/api";


export async function getFreeChargeAvailable(): Promise<{available: boolean}> {
    const response = await axiosInstance.get('/api/users/wallet/charge/free/available')
    return response.data
}