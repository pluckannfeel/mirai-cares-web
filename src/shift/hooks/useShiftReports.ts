import { useQuery } from "react-query";
import { ShiftReport } from "../types/shiftReport";
import { axiosInstance } from "../../api/server";

const fetchShiftReports = async (): Promise<ShiftReport[]> => {
  const { data } = await axiosInstance.get("/shift_report");

  return data;
};

export function useShiftReports() {
  return useQuery<ShiftReport[]>("shift_reports", fetchShiftReports);
}
