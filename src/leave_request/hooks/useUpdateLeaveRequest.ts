import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { LeaveRequest } from "../types/LeaveRequest";
import { axiosInstance } from "../../api/server";

const updateLeaveRequest = async (
  leaveRequest: LeaveRequest
): Promise<LeaveRequest> => {
  const formData = new FormData();

  formData.append("leave_request_json", JSON.stringify(leaveRequest));

  const { data } = await axiosInstance.put(
    "/staff/update_leave_request",
    formData
    // {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // }
  );

  return data;
};

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateLeaveRequest, {
    onSuccess: (leaveRequest) => {
      queryClient.setQueryData<LeaveRequest[]>(
        ["leave_requests"],
        (oldLeaveRequests) => updateOne(oldLeaveRequests, leaveRequest)
      );
    },
  });

  return { isUpdating: isLoading, updateLeaveRequest: mutateAsync };
}
