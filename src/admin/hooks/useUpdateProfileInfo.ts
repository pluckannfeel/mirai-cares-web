// import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ProfileInfo } from '../types/profileInfo';
import { axiosInstance } from '../../api/server';

const updateProfileInfo = async (
  profileInfo: ProfileInfo
): Promise<ProfileInfo> => {
  // const { data } = await axios.put("/api/profile-info", profileInfo);
  console.log(profileInfo)

  const formData = {
    first_name: profileInfo.first_name,
    last_name: profileInfo.last_name,
    email: profileInfo.email,
    phone: profileInfo.phone,
    job: profileInfo.job,
    role: profileInfo.role,
  };

  const { data } = await axiosInstance.put(
    '/users/update_user_info/?user_id=' + profileInfo.id,
    formData
  );

  return data;
};

export function useUpdateProfileInfo() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateProfileInfo, {
    onSuccess: (profileInfo: ProfileInfo) => {
      queryClient.setQueryData(['profile-info'], profileInfo);
    },
  });

  return { isUpdating: isLoading, updateProfileInfo: mutateAsync };
}
