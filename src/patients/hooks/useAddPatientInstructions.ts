import { useMutation, useQueryClient } from "react-query";
import { Instructions, Patient } from "../types/patient";
// import { AxiosResponse } from "axios"; // Import AxiosResponse for type checking
import { axiosInstance } from "../../api/server";

interface UploadedInstructionsData {
  patientId: string;
  instructions: Instructions[];
}

const addPatientInstructions = async ({
  patientId,
  instructions,
}: {
  patientId: string;
  instructions: Instructions[] | [];
}): Promise<UploadedInstructionsData> => {
  const formData = new FormData();

  // append instructions (files)
  if (instructions) {
    instructions.forEach((instruction) => {
      formData.append("instructions_files", instruction.file);
    });
  }

  // since we took the instructions.file and put it in the formData, remove the file from instructions
  const instructions_without_file = instructions.map((instruction: Instructions) => {
    const { file, ...rest } = instruction;
    return rest;
  });

  const patient_data = {
    id: patientId,
    instructions: instructions_without_file,
  };

  formData.append("patient_json", JSON.stringify(patient_data));

  // we have a json object that should contain like this
  // [{ patient_id: "1", instructions: [{ title: "test", (NO FILE) }] }
  // since the formdata doesnt accept files, we need to take the file out of the instructions
  // and put it separately in the formData
  // api will process (upload) the files and return the file url then put it back in the instructions object as string url

  const { data } = await axiosInstance.put(
    "/patients/add_patient_instructions",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export function useAddPatientInstructions() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addPatientInstructions, {
    onSuccess: (data) => {
      const { patientId, instructions } = data;
      queryClient.setQueryData<Patient | undefined>(
        ["patients", patientId],
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              // here we only update the instructions from that specific patient
              instructions,
            };
          }
          return undefined;
        }
      );
    },
  });

  return { isAddingPatient: isLoading, addPatientInstructions: mutateAsync };
}
