import { useMutation, useQueryClient } from "react-query";
import { removeOne } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";

const deleteStaffWorkSchedule = async (id: string): Promise<string> => {
  const { data } = await axiosInstance.delete(`/staff/delete_shift/${id}`);
  return data;
};

export function useDeleteStaffWorkSchedule() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteStaffWorkSchedule, {
    onSuccess: (shiftId: string) => {
      queryClient.setQueryData<StaffWorkSchedule[]>(["shifts"], (oldShifts) =>
        removeOne(oldShifts, shiftId)
      );
    },
  });

  return { isDeleting: isLoading, deleteStaffWorkSchedule: mutateAsync };
}
