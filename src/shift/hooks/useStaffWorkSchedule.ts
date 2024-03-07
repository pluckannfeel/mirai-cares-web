import { useQuery } from "react-query";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { axiosInstance } from "../../api/server";

const fetchStaffWorkSchedules = async (): Promise<StaffWorkSchedule[]> => {
  const { data } = await axiosInstance.get("/shift");
  // you can add affiliation later on if you want to filter by affiliation like angel care services etc..
  return data;
};

export function useStaffWorkSchedules() {
  return useQuery(["shifts"], () => fetchStaffWorkSchedules(), {});
}
