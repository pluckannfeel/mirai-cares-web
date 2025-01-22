import { useMutation, useQueryClient } from "react-query";
// import { updateOne } from "../../core/utils/crudUtils";
import { CompanyParking } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const updateCompanyParking = async (
  companyParking: CompanyParking
): Promise<CompanyParking> => {
  const companyParkingData = {
    ...companyParking,
  };

  const formData = new FormData();
  formData.append("company_parking_json", JSON.stringify(companyParkingData));

  const { data } = await axiosInstance.put(
    "companies/update_company_parking",
    formData
  );
  return data;
};

export default function useUpdateCompanyParking() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateCompanyParking, {
    onSuccess: (newCompanyParking: CompanyParking) => {
      //   queryClient.setQueryData<CompanyParking[]>(
      //     ["company_parking"],
      //     (oldCompanyParking) => updateOne(oldCompanyParking, newCompanyParking)
      //   );
      // invalidate
      queryClient.invalidateQueries(["company_parking"]);
    },
  });

  return { isUpdating: isLoading, updateCompanyParking: mutateAsync };
}
