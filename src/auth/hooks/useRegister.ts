import { useMutation } from 'react-query';
import { UserInfo } from '../types/userInfo';
import { axiosInstance } from '../../api/server';

const register = async (userInfo: UserInfo): Promise<UserInfo> => {
  // console.log(userInfo);
  // mock data
  // const { data } = await axios.post('/api/register', userInfo);

  const formData = {
    first_name: userInfo.first_name,
    last_name: userInfo.last_name,
    email: userInfo.email,
    password: userInfo.password,
    role: userInfo.role,
  };

  const { data } = await axiosInstance.post('/users/register', formData);

  return data;
};

export function useRegister() {
  const { isLoading, mutateAsync } = useMutation(register);
  return { isRegistering: isLoading, register: mutateAsync };
}
