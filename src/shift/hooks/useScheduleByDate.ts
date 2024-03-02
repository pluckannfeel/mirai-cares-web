import { useQuery } from "react-query";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { axiosInstance } from "../../api/server";

const fetchScheduleByDate = async (date: string) => {
  const { data } = await axiosInstance.get("/staff/shift_by_date", {
    params: { date: date },
  });

  return data;
};

export function useScheduleByDate(date: string) {
  return useQuery(["schedule-by-date", date], () => fetchScheduleByDate(date), {
    enabled: !!date,
  });
}
