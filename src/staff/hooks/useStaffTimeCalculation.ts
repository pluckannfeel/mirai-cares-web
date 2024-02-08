import { useQuery } from "react-query";
import { StaffTimeRecord } from "../types/calculations";
import { axiosInstance } from "../../api/server";

const fetchStaffTimeCalculation = async (
  selectedDate: string
): Promise<StaffTimeRecord[]> => {
  const formData = new FormData();

  formData.append("selected_date", selectedDate);

  const { data } = await axiosInstance.post(
    "/staff/all_staff_time_calculation",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export function useStaffTimeCalculation(selectedDate: string) {
  return useQuery(
    ["staff-time-calculation", selectedDate],
    () => fetchStaffTimeCalculation(selectedDate),
    {
      enabled: !!selectedDate,
    }
  );
}
