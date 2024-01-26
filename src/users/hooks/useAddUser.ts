import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { axiosInstance } from "../../api/server";

const addUser = async (user: User): Promise<User> => {
  const { data } = await axiosInstance.post("/api/users", user);
  return data;
};

export function useAddUser() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addUser, {
    onSuccess: (user: User) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        addOne(oldUsers, user)
      );
    },
  });

  return { isAdding: isLoading, addUser: mutateAsync };
}
