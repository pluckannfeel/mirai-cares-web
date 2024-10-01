import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils"; // or use react query's useMutation's invalidate queries
import { NursingStation } from "../types/NursingStation";
import { axiosInstance } from "../../api/server";

const addNursingstations = async (
  nursingStation: NursingStation
): Promise<NursingStation> => {
  const nursingStationData = {
    ...nursingStation,
  };

  const formData = new FormData();
  formData.append("nursing_station_json", JSON.stringify(nursingStationData));

  const { data } = await axiosInstance.post(
    "nursing_stations/add_nursing_station",
    formData
  );
  return data;
};

export function useAddNursingStation() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addNursingstations, {
    onSuccess: (newNursingStation: NursingStation) => {
      queryClient.setQueryData<NursingStation[]>(
        ["nursing_stations"],
        (oldNursingStations) => addOne(oldNursingStations, newNursingStation)
      );
    },
  });

  return { isAdding: isLoading, addNursingStation: mutateAsync };
}
