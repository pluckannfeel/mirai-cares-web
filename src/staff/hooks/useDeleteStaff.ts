import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { Staff } from "../types/staff";

const deleteStaff = async (staffIds: string[]): Promise<string[]> => {
  // const { data } = await axios.delete("/api/users", { data: userIds });

  const staff_form_data = {
    staff: staffIds,
  };

  const formData = new FormData();
  formData.append("staff_json", JSON.stringify(staff_form_data));

  const { data } = await axiosInstance.put("/staff/delete_staff", formData);
  return data;
};

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteStaff, {
    onSuccess: (staffIds: string[]) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) =>
        removeMany(oldStaff, staffIds)
      );
    },
  });

  return { isDeleting: isLoading, deleteStaff: mutateAsync };
}
