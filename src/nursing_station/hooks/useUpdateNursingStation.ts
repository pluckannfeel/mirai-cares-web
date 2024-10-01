import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { NursingStation } from "../types/NursingStation";
import { axiosInstance } from "../../api/server";

const updateNursingStation = async (
  nursingStation: NursingStation
): Promise<NursingStation> => {
  const nursingStationData = {
    ...nursingStation,
  };

  const formData = new FormData();
  formData.append("nursing_station_json", JSON.stringify(nursingStationData));

  const { data } = await axiosInstance.put(
    "nursing_stations/update_nursing_station",
    formData
  );
  return data;
};

export function useUpdateNursingStation() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateNursingStation, {
    onSuccess: (newNursingStation: NursingStation) => {
      queryClient.setQueryData<NursingStation[]>(
        ["nursing_stations"],
        (oldNursingStations) => updateOne(oldNursingStations, newNursingStation)
      );
    },
  });

  return { isUpdating: isLoading, updateNursingStation: mutateAsync };
}
