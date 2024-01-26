import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { LeaveRequest } from "../types/LeaveRequest";

const fetchleaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data } = await axiosInstance.get(`/staff/leave_requests`);
  return data;
};

export function useStaffLeaveRequests() {
  return useQuery(
    ["leave_requests"],
    () => fetchleaveRequests()
    // {
    //   enabled: !!staff_id, // Fetch the report only if the ID is truthy
    // }
  );
}
