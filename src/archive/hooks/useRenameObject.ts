import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
import { APIRequestResponse } from "../types/archive";

const renameObject = async ({
  oldPath,
  newPath,
  userName,
}: {
  oldPath: string;
  newPath: string;
  userName?: string;
}): Promise<APIRequestResponse> => {
  const payload = {
    old_key: oldPath,
    new_key: newPath,
    user_name: userName || "unknown",
  };

  const { data } = await axiosInstance.put("/archive/rename_object", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // set delay 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return data;
};

export const useRenameObject = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(renameObject, {
    onSuccess: (response: APIRequestResponse) => {
      if (response.code === "success") {
        queryClient.invalidateQueries("archive-current-files");
      }

      if (response.code === "error") {
        throw new Error(response.message);
      }
    },
  });

  return { isRenaming: isLoading, renameObject: mutateAsync };
};
