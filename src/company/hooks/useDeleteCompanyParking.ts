import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { CompanyParking } from "../types/companyInfo";

const deleteCompanyParking = async (
  companyHousingIds: string[]
): Promise<string[]> => {
  // Send multiple deletions via individual API calls for each ID
  const deletionPromises = companyHousingIds.map((id) =>
    axiosInstance.delete(`/companies/delete_company_parking`, {
      params: { company_parking_id: id },
    })
  );

  // Await all deletions and return successful IDs
  await Promise.all(deletionPromises);
  return companyHousingIds;
};

export function useDeleteCompanyParking() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteCompanyParking, {
    onSuccess: (companyParkingIds: string[]) => {
      queryClient.setQueryData<CompanyParking[]>(
        ["company_parking"],
        (oldCompanyParking) => removeMany(oldCompanyParking, companyParkingIds)
      );
    },
  });

  return { isDeleting: isLoading, deleteCompanyParking: mutateAsync };
}
