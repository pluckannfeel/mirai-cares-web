import { useQuery } from "react-query";
import { Staff } from "../../staff/types/staff";
import { axiosInstance } from "../../api/server";

const fetchStaffCodeList = async (): Promise<Staff[]> => {
  const { data } = await axiosInstance.get("staff/staffcode_list");
  return data;
};

export function useStaffCodeList(email?: string, group?: string) {
  return useQuery(["staff"], () => fetchStaffCodeList(), {
    // staleTime: Infinity,
  });
}
