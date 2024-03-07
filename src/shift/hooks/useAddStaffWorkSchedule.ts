import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { axiosInstance } from "../../api/server";

const addStaffWorkSchedule = async (
  staff_work_schedule: StaffWorkSchedule
): Promise<StaffWorkSchedule> => {
  const staff_work_schedule_form_data = {
    ...staff_work_schedule,
  };

  const formData = new FormData();

  formData.append(
    "staff_shift_json",
    JSON.stringify(staff_work_schedule_form_data)
  );

  const { data } = await axiosInstance.post(
    "/shift/add_shift",
    formData
  );

  return data;
};

export function useAddStaffWorkSchedule() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addStaffWorkSchedule, {
    onSuccess: (staff_work_schedule: StaffWorkSchedule) => {
      queryClient.setQueryData<StaffWorkSchedule[]>(
        ["shifts"],
        (oldStaffWorkSchedule) =>
          addOne(oldStaffWorkSchedule, staff_work_schedule)
      );
    },
  });

  return { isAdding: isLoading, addStaffWorkSchedule: mutateAsync };
}