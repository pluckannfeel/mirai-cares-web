import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
import { APIRequestResponse } from "../types/archive";

const replaceFile = async ({
  file,
  currentPath,
}: {
  file: File;
  currentPath: string;
}): Promise<APIRequestResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("current_path", currentPath);

  const { data } = await axiosInstance.post("/archive/replace_file", formData);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return data;
};

export const useReplaceFile = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(replaceFile, {
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

  return { isReplacing: isLoading, replaceFile: mutateAsync };
};
