/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
import { APIRequestResponse } from "../types/archive";

const uploadFile = async ({
  file,
  currentPath,
  userName,
}: {
  file: File;
  currentPath: string;
  userName?: string;
}): Promise<APIRequestResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("current_path", currentPath);
  formData.append("user_name", userName || "unknown");

  const { data } = await axiosInstance.post("/archive/upload_file", formData);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return data;
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync, isError } = useMutation(uploadFile, {
    onSuccess: (response) => {
      if (response.code === "success") {
        queryClient.invalidateQueries("archive-current-files");
      }

      //   if (response.code === "error") {
      //     throw new Error(response.message);
      //   }

      //   if (response.code === "fileExists") {
      //     throw new Error("fileExists");
      //   }
    },
    // onError: (error) => {
    //   // pass it to the parent component
    //   console.log(error);
    // },
  });

  return { isUploading: isLoading, uploadFile: mutateAsync };
};
