import { useMutation } from "react-query";
// import { ProfileInfo } from '../types/profileInfo';
import { axiosInstance } from "../../api/server";


const fetchStaffContract = async (staff_id: string): Promise<string> => {
  const { data } = await axiosInstance.get(
    "/staff/generate?staff_id=" + staff_id
  );
  return data as string;
};

export function useStaffCompanyContract() {
  const { isLoading, mutateAsync } = useMutation(fetchStaffContract);

  return {
    isFetching: isLoading,
    fetchStaffContract: (staff_id: string) => mutateAsync(staff_id),
  };
}
