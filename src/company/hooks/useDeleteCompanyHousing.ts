import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { CompanyHousing } from "../types/companyInfo";

const deleteCompanyHousing = async (companyHousingIds: string[]): Promise<string[]> => {
  // Send multiple deletions via individual API calls for each ID
  const deletionPromises = companyHousingIds.map((id) =>
    axiosInstance.delete(`/companies/delete_company_housing`, {
      params: { company_housing_id: id },
    })
  );

  // Await all deletions and return successful IDs
  await Promise.all(deletionPromises);
  return companyHousingIds;
};

export function useDeleteCompanyHousing() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteCompanyHousing, {
    onSuccess: (companyHousingIds: string[]) => {
      queryClient.setQueryData<CompanyHousing[]>(
        ["company_housing"],
        (oldCompanyHousing) => removeMany(oldCompanyHousing, companyHousingIds)
      );
    },
  });

  return { isDeleting: isLoading, deleteCompanyHousing: mutateAsync };
}
