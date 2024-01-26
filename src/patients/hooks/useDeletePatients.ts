import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { Patient } from "../types/patient";

const deletePatients = async (patientIds: string[]): Promise<string[]> => {
  // const { data } = await axios.delete("/api/users", { data: userIds });

  const patient_form_data = {
   patients: patientIds,
  };

  const formData = new FormData();
  formData.append("patient_json", JSON.stringify(patient_form_data));

  const { data } = await axiosInstance.put("/patients/delete_patients", formData);
  return data;
};

export function useDeletePatients() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deletePatients, {
    onSuccess: (patientIds: string[]) => {
      queryClient.setQueryData<Patient[]>(["patients"], (oldPatients) =>
        removeMany(oldPatients, patientIds)
      );
    },
  });

  return { isDeleting: isLoading, deletePatients: mutateAsync };
}