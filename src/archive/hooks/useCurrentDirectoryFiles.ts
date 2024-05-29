import { useQuery } from "react-query";
// import { StaffTimeRecord } from "../../staff/types/calculations";
import { axiosInstance } from "../../api/server";
import { ArchiveFolder } from "../types/archive";

const fetchCurrentDirectoryFiles = async (
  key: string
): Promise<ArchiveFolder> => {
  //   const { data } = await axiosInstance.get(
  //     `/archive/current_directory/${key}`,
  //     {
  //       params: key,
  //     }
  //   );

  const { data } = await axiosInstance.get("/archive/current_directory", {
    params: { folder_path: key },
  });

//   console.log(data);

  return data;
};

export function useCurrentDirectoryFiles(key: string) {
  return useQuery(
    ["archive-current-files", key],
    () => fetchCurrentDirectoryFiles(key),
    {
      enabled: !!key,
    }
  );
}
