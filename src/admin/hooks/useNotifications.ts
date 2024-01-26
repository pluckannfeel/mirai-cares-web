import { useQuery } from "react-query";
import { Notification } from "../types/notification";
import { axiosInstance } from "../../api/server";

const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await axiosInstance.get("/notifications");

  return data;
};

export function useNotifications() {
  return useQuery("notifications", () => fetchNotifications(), {
    suspense: false,
  });
}
