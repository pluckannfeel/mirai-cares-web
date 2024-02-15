import { useMutation, useQueryClient } from "react-query";
import { ArchiveFolder } from "../types/archive";
import { axiosInstance } from "../../api/server";
import { addOne } from "../../core/utils/crudUtils";

type CreateFolderResponse = {
  code: string;
  message: string;
};

const createS3Folder = async ({
  folderName,
  currentPath,
}: {
  folderName: string;
  currentPath: string;
}): Promise<CreateFolderResponse> => {
  const formData = new FormData();

  formData.append("folder_name", folderName);
  formData.append("current_path", currentPath);

  const { data } = await axiosInstance.post("/archive/create_folder", formData);

  return data;
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(createS3Folder, {
    onSuccess: (response: CreateFolderResponse) => {
      // update the current directory files
      if (response.code === "success") {
        queryClient.invalidateQueries("archive-current-files");
      }
      // // throw error
      if (response.code === "error") {
        throw new Error(response.message);
      }

      // queryClient.setQueryData<ArchiveFolder[]>(
      //   ["archive-current-files"],
      //   (oldFolders) => addOne(oldFolders, response)
      // );
    },
  });

  return { isCreating: isLoading, createFolder: mutateAsync };
};
