import { useQuery } from "react-query";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import { axiosInstance } from "../../api/server";

// same as useStaff but limited information
const fetchStaffSelect = async (): Promise<StaffScheduleSelect[]> => {
  // const {data} = await axiosInstance.get(
  //     'staff/?user_email_token=' + email + '&staff_group=' + group
  // ) // if we were to make it as commercial, then we would need to add a query parameter for the user's email token
  // plus an organization id parameter

  // now we will open it all up for now
  // const {data} = await axiosInstance.get(
  const { data } = await axiosInstance.get("staff/staff_select");

  // add age to the data object based on birth_date
  data.forEach((item: any) => {
    item.age =
      new Date().getFullYear() - new Date(item.birth_date).getFullYear();
  });

  return data;
};

export function useStaffSelect() {
  return useQuery(["staff-select"], () => fetchStaffSelect(), {
    // enabled: !!group,
  });
}
