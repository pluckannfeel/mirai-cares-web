import { useMutation, useQueryClient } from "react-query";
// import { addOne } from "../../core/utils/crudUtils";
import { axiosInstance } from "../../api/server";
import { TaxCertificate } from "../types/taxcertificate";

const addTaxCertificate = async (
  taxcertificate: TaxCertificate
): Promise<TaxCertificate> => {
  const taxcertificateFile = taxcertificate.file_url;

  const taxcertificate_data_form = {
    ...taxcertificate,
  };

  delete taxcertificate_data_form.file_url;

  const formData = new FormData();
  formData.append(
    "taxcertificate_json",
    JSON.stringify(taxcertificate_data_form)
  );

  if (taxcertificateFile)
    formData.append("taxcertificate_file", taxcertificateFile);

  const { data } = await axiosInstance.post(
    "/taxcertificate/add_taxcertificate",
    formData
  );

  return data;
};

export const useAddTaxCertificate = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addTaxCertificate, {
    onSuccess: () => {
      queryClient.invalidateQueries("taxcertificates");
      // queryClient.setQueryData<TaxCertificate[]>(["taxcertificates"], (oldTaxCertificate) => {
      //   return addOne(oldTaxCertificate, data);
      // });
    },
  });

  return { isAdding: isLoading, addTaxCertificate: mutateAsync };
};
