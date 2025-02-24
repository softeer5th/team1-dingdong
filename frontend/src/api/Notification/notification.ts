import { axiosInstance } from "..";

export const getNotification = async () => {
  try {
    const { data } = await axiosInstance.get(
      "/api/users/notifications?page=0&pageSize=15"
    );
    return data;
  } catch (e) {
    console.error(e);
  }
};
