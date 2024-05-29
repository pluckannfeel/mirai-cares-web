import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
import { APIRequestResponse } from "../types/archive";

const deleteFiles = async (filePaths: string[]): Promise<APIRequestResponse> => {
  const { data } = await axiosInstance.delete("/archive/delete_files", {
    data: { files: filePaths },
  });

  return data;
};

export const useDeleteFiles = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteFiles, {
    onSuccess: () => {
      queryClient.invalidateQueries("archive-current-files");
    },
  });

  return { isDeleting: isLoading, deleteFiles: mutateAsync };
};
