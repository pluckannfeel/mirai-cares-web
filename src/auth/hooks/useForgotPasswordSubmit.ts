import { useMutation } from "react-query";
import { axiosInstance } from "../../api/server";

const forgotPasswordSubmit = async ({
  code,
  newPassword,
}: {
  code: string;
  newPassword: string;
}) => {
  const { data } = await axiosInstance.post("/api/forgot-password-submit", {
    code,
    newPassword,
  });
  return data;
};

export function useForgotPasswordSubmit() {
  const { isLoading, mutateAsync } = useMutation(forgotPasswordSubmit);
  return { isLoading, forgotPasswordSubmit: mutateAsync };
}
