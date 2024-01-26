import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Patient } from "../types/patient";
import { axiosInstance } from "../../api/server";

const updatePatient = async (patient: Patient): Promise<Patient> => {
  const patient_form_data = {
    ...patient,
  };

  const formData = new FormData();

  formData.append("patient_json", JSON.stringify(patient_form_data));

  const { data } = await axiosInstance.put(
    "/patients/update_patient",
    formData
  );

  return data;
};

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updatePatient, {
    onSuccess: (patient: Patient) => {
      queryClient.setQueryData<Patient[]>(["patients"], (oldPatient) =>
        updateOne(oldPatient, patient)
      );
    },
  });

  return { isUpdating: isLoading, updatePatient: mutateAsync };
}
