import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { MedicalInstitution } from "../types/MedicalInstitution";

const deleteInstitutions = async (
  institutionIds: string[]
): Promise<string[]> => {
  // const { data } = await axios.delete("/api/users", { data: userIds });

  const institution_form_data = {
    institutions: institutionIds,
  };

  const formData = new FormData();
  formData.append("institution_json", JSON.stringify(institution_form_data));

  const { data } = await axiosInstance.put(
    "/medical_institutions/delete_medical_institutions",
    formData
  );
  return data;
};

export function useDeleteInstitutions() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteInstitutions, {
    onSuccess: (institutionIds: string[]) => {
      queryClient.setQueryData<MedicalInstitution[]>(
        ["medical_institutions"],
        (oldInstitutions) => removeMany(oldInstitutions, institutionIds)
      );
    },
  });

  return { isDeleting: isLoading, deleteInstitutions: mutateAsync };
}
