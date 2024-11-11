// import axios from 'axios';
import { useQuery } from 'react-query';
import { ProfileInfo } from '../types/profileInfo';
// import { useAuth } from "../../auth/contexts/AuthProvider";
import { axiosInstance } from '../../api/server';

const fetchProfileInfo = async (email?: string): Promise<ProfileInfo> => {
  // const { data } = await axios.get("/api/profile-info");
  const { data } = await axiosInstance.get(
    '/users/?email=' + email
  );
  // console.log(data)
  return data;
};

// added email from userInfo as parameter to fetchProfileInfo  
export function useProfileInfo(email?: string) {
  return useQuery(['profile-info', email], () => fetchProfileInfo(email), {
    enabled: !!email,
  });
}


// export function useProfileInfo() {
//   return useQuery('profile-info', () => fetchProfileInfo());
// }
