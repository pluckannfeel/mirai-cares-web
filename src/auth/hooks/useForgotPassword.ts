import { useMutation } from "react-query";
import { axiosInstance } from "../../api/server";

const forgotPassword = async ({ email }: { email: string }) => {
  const { data } = await axiosInstance.post("/api/forgot-password", { email });
  return data;
};

export function useForgotPassword() {
  const { isLoading, mutateAsync } = useMutation(forgotPassword);
  return { isLoading, forgotPassword: mutateAsync };
}
