import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { CompanyHousing } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const updateCompanyHousing = async (
  companyHousing: CompanyHousing
): Promise<CompanyHousing> => {
  const companyHousingData = {
    ...companyHousing,
  };

  const formData = new FormData();
  formData.append("company_housing_json", JSON.stringify(companyHousingData));

  const { data } = await axiosInstance.put(
    "companies/update_company_housing",
    formData
  );
  return data;
};

export function useUpdateCompanyHousing() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateCompanyHousing, {
    onSuccess: (newCompanyHousing: CompanyHousing) => {
      //   queryClient.setQueryData<CompanyHousing[]>(
      //     ["company_housing"],
      //     (oldCompanyHousing) => updateOne(oldCompanyHousing, newCompanyHousing)
      //   );
      // invalidate
      queryClient.invalidateQueries(["company_housing"]);
    },
  });

  return { isUpdating: isLoading, updateCompanyHousing: mutateAsync };
}
