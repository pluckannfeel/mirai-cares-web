import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
// import { APIRequestResponse } from "../types/archive";

const downloadFiles = async (filePaths: string[]): Promise<string> => {
  const { data } = await axiosInstance.post("/archive/download_files", {
    files: filePaths,
  });

  return data;
};

export const useDownloadFiles = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(downloadFiles, {
    // onSuccess: (APIRequestResponse) => {
    //   queryClient.invalidateQueries("archive-current-files");
    // },
  });

  return { isDownloading: isLoading, downloadFiles: mutateAsync };
};
