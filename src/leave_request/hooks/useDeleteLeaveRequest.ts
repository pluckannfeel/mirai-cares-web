import { useMutation, useQueryClient } from "react-query";
import { removeOne } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { LeaveRequest } from "../types/LeaveRequest";

const deleteLeaveRequest = async (id: string): Promise<string> => {
  const { data } = await axiosInstance.delete(
    `/staff/delete_leave_request/${id}`
  );
  return data;
};

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteLeaveRequest, {
    onSuccess: (leaveRequestId: string) => {
      queryClient.setQueryData<LeaveRequest[]>(
        ["leave_requests"],
        (oldLeaveRequests) => removeOne(oldLeaveRequests, leaveRequestId)
      );
    },
  });

  return { isDeleting: isLoading, deleteLeaveRequest: mutateAsync };
}
