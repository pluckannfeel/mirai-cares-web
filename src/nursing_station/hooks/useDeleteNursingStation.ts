import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { NursingStation } from "../types/NursingStation";

const deleteNursingStation = async (
  nursingStationIds: string[]
): Promise<string[]> => {
  const nursing_station_form_data = {
    nursing_stations: nursingStationIds,
  };

  const formData = new FormData();
  formData.append(
    "nursing_station_json",
    JSON.stringify(nursing_station_form_data)
  );

  const { data } = await axiosInstance.put(
    "/nursing_stations/delete_nursing_stations",
    formData
  );
  return data;
};

export function useDeleteNursingStation() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteNursingStation, {
    onSuccess: (nursingStationIds: string[]) => {
      queryClient.setQueryData<NursingStation[]>(
        ["nursing_stations"],
        (oldNursingStations) =>
          removeMany(oldNursingStations, nursingStationIds)
      );
    },
  });

  return { isDeleting: isLoading, deleteNursingStation: mutateAsync };
}
