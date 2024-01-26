// import axios from 'axios';
import { useMutation } from 'react-query';
import { axiosInstance } from '../../api/server';

const updatePassword = async ({
  email,
  oldPassword,
  newPassword,
}: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  // const { data } = await axios.put("/api/password", {
  //   oldPassword,
  //   newPassword,
  // });

  const { data } = await axiosInstance.put('/users/change_password/', {
    email,
    old_password: oldPassword,
    new_password: newPassword,
  });

  return data;
};

export function useUpdatePassword() {
  const { isLoading, mutateAsync } = useMutation(updatePassword);
  return { isUpdating: isLoading, updatePassword: mutateAsync };
}
