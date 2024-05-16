import { useMutation, useQueryClient } from "react-query";
// import { addOne } from "../../core/utils/crudUtils";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { axiosInstance } from "../../api/server";

const importStaffShift = async (csvFile: File): Promise<StaffWorkSchedule> => {
  //set a timeout for about 30 seconds to test the loading state

  const formData = new FormData();
  formData.append("import_file", csvFile);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { data } = await axiosInstance.post(
    "/shift/import_staff_shift",
    formData
  );

  return data;
};

export function useImportStaffShift() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(importStaffShift, {
    onSuccess: () => {
      queryClient.invalidateQueries("shifts");
      // queryClient.setQueryData<StaffWorkSchedule[]>(["shifts"], (oldStaff) =>
      //   addOne(oldStaff, shifts)
      // );
    },
  });

  return { isImporting: isLoading, importStaffShift: mutateAsync };
}
