import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
import { APIRequestResponse } from "../types/archive";

const renameFolder = async ({
  oldPath,
  newPath,
  userName,
}: {
  oldPath: string;
  newPath: string;
  userName?: string;
}): Promise<APIRequestResponse> => {
  const formData = new FormData();

  formData.append("old_path", oldPath);
  formData.append("new_path", newPath);
  formData.append("user_name", userName || "unknown");

  const { data } = await axiosInstance.post("/archive/rename_folder", formData);

  return data;
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(renameFolder, {
    onSuccess: (response: APIRequestResponse) => {
      if (response.code === "success") {
        queryClient.invalidateQueries("archive-current-files");
      }

      if (response.code === "error") {
        throw new Error(response.message);
      }
    },
  });

  return { isRenaming: isLoading, renameFolder: mutateAsync };
};
