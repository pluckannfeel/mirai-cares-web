import { useQuery } from "react-query";
import { Staff } from "../types/staff";
import { axiosInstance } from "../../api/server";

const fetchStaff = async (email?: string, group?: string): Promise<Staff[]> => {
  // const {data} = await axiosInstance.get(
  //     'staff/?user_email_token=' + email + '&staff_group=' + group
  // ) // if we were to make it as commercial, then we would need to add a query parameter for the user's email token
  // plus an organization id parameter
  // now we will open it all up for now
  // const {data} = await axiosInstance.get(
  const { data } = await axiosInstance.get("staff?staff_group=" + group);
  return data;
};

export function useStaff(email?: string, group?: string) {
  return useQuery(["staff"], () => fetchStaff(email, group), {
    enabled: !!email,
    // staleTime: Infinity,
  });
}
