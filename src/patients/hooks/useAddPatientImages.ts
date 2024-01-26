import { useMutation, useQueryClient } from "react-query";
import { Patient } from "../types/patient";
// import { AxiosResponse } from "axios"; // Import AxiosResponse for type checking
import { axiosInstance } from "../../api/server";

interface UploadedImageData {
  patientId: string;
  images: string[];
}

async function addPatientImages({
  patientId,
  images,
}: {
  patientId: string;
  images: File[] | null | undefined;
}): Promise<UploadedImageData> {
  const formData = new FormData();
  formData.append("patient_id", patientId);

  if (images) {
    images.forEach((image, index) => {
      formData.append("images", image);
    });
  }

  const { data } = await axiosInstance.put(
    "/patients/add_patient_images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export function useAddPatientImages() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addPatientImages, {
    onSuccess: (data) => {
      const { patientId, images } = data;
      queryClient.setQueryData<Patient | undefined>(
        ["patients", patientId],
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              //   images: [...(oldData.images || []), image_url],
              images,
            };
          }
          return undefined;
        }
      );
    },
  });

  return { isAddingImages: isLoading, addPatientImages: mutateAsync };
}
