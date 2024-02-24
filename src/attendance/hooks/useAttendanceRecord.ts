import { useQuery } from "react-query";
import { AttendanceRecord } from "../types/attendance";
import { axiosInstance } from "../../api/server";

const fetchAttendanceRecord = async (
  selectedDate: string
): Promise<AttendanceRecord[]> => {
  const { data } = await axiosInstance.get(`/staff_attendance/shift_by_date?`, {
    params: { selected_date: selectedDate },
  });
  return data;
};

export function useAttendanceRecord(selectedDate: string) {
  return useQuery(
    ["attendance-record", selectedDate],
    () => fetchAttendanceRecord(selectedDate),
    {
      enabled: !!selectedDate,
    }
  );
}
