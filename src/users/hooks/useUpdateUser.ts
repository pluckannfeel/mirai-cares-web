import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { axiosInstance } from "../../api/server";

const updateUser = async (user: User): Promise<User> => {
  const { data } = await axiosInstance.put("/api/users", user);
  return data;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateUser, {
    onSuccess: (user: User) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        updateOne(oldUsers, user)
      );
    },
  });

  return { isUpdating: isLoading, updateUser: mutateAsync };
}
