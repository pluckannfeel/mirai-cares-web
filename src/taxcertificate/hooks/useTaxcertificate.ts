import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { TaxCertificate } from "../types/taxcertificate";

const fetchTaxCertificates = async (): Promise<TaxCertificate[]> => {
  const { data } = await axiosInstance.get("taxcertificate");
  // you can add affiliation later on if you want to filter by affiliation like angel care services etc..
  return data;
};

export function useTaxCertificates() {
  return useQuery(["taxcertificates"], () => fetchTaxCertificates(), {});
}
