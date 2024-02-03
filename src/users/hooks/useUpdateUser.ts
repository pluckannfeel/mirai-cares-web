import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { axiosInstance } from "../../api/server";

const updateUser = async (user: User): Promise<User> => {
  const formData = new FormData();

  formData.append("user_json", JSON.stringify(user));

  const { data } = await axiosInstance.put(
    "/users/update_user_info",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateUser, {
    onSuccess: (user: User) => {
      queryClient.invalidateQueries("users");
      // queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
      //   updateOne(oldUsers, user)
      // );
    },
  });

  return { isUpdating: isLoading, updateUser: mutateAsync };
}
