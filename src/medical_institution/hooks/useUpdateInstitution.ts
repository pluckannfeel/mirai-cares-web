import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { MedicalInstitution } from "../types/MedicalInstitution";
import { axiosInstance } from "../../api/server";

const updateInstitution = async (
  institution: MedicalInstitution
): Promise<MedicalInstitution> => {
  const institution_data_form = {
    ...institution,
  };

  const formData = new FormData();
  formData.append("institution_json", JSON.stringify(institution_data_form));

  const { data } = await axiosInstance.put(
    "medical_institutions/update_medical_institution",
    formData
  );
  return data;
};

export function useUpdateInstitution() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateInstitution, {
    onSuccess: (newInstitution: MedicalInstitution) => {
      queryClient.setQueryData<MedicalInstitution[]>(
        ["medical_institutions"],
        (oldInstitutions) => updateOne(oldInstitutions, newInstitution)
      );
    },
  });

  return { isUpdating: isLoading, updateInstitution: mutateAsync };
}
