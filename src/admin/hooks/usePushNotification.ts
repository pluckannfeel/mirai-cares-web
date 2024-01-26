// push notifications to tokens depending on staff code
import { useMutation, useQueryClient } from "react-query";
import { Notification, PushNotification } from "../types/notification";
import { axiosInstance } from "../../api/server";

const pushNotification = async (
  notification: PushNotification
): Promise<Notification> => {
  const formData = new FormData();

  formData.append("notification_json", JSON.stringify(notification));

  const { data } = await axiosInstance.post(
    "/notifications/send_push_notification",
    formData
  );

  return data;
};

export function usePushNotification() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(pushNotification, {
    onSuccess: (notification: Notification) => {
      queryClient.invalidateQueries("notifications");
    },
  });

  return { isSending: isLoading, pushNotification: mutateAsync };
}
