import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Patient } from "../types/patient";
import { axiosInstance } from "../../api/server";

const addPatient = async (patient: Patient): Promise<Patient> => {
  const patient_form_data = {
    ...patient,
  };

  const formData = new FormData();

  formData.append("patient_json", JSON.stringify(patient_form_data));

  const { data } = await axiosInstance.post("/patients/add_patient", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export function useAddPatient() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addPatient, {
    onSuccess: (patient: Patient) => {
      queryClient.setQueryData<Patient[]>(["patients"], (oldPatient) =>
        addOne(oldPatient, patient)
      );
    },
  });

  return { isAdding: isLoading, addPatient: mutateAsync };
}
