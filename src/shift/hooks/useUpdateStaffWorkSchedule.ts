import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { axiosInstance } from "../../api/server";

const updateStaffWorkSchedule = async (
  shift: StaffWorkSchedule
): Promise<StaffWorkSchedule> => {
  const formData = new FormData();

  //   const shift_data = {
  //     ...shift,
  //     start: new Date(shift["start"]),
  //     end: new Date(shift["end"]),
  //   };

  formData.append("staff_shift_json", JSON.stringify(shift));

  const { data } = await axiosInstance.put("/staff/update_shift", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export function useUpdateStaffWorkSchedule() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateStaffWorkSchedule, {
    onSuccess: (shift) => {
      //   queryClient.invalidateQueries("shifts");
      // console.log(shift)
      queryClient.setQueryData<StaffWorkSchedule[]>(["shifts"], (oldShifts) =>
        updateOne(oldShifts, shift)
      );
    },
  });

  return { isUpdating: isLoading, updateStaffWorkSchedule: mutateAsync };
}
