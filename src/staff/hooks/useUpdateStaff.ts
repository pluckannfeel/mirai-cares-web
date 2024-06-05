import { useMutation, useQueryClient } from "react-query";
import { Staff } from "../types/staff";
import { axiosInstance } from "../../api/server";
import { renameFile, staffUploadFile } from "../helpers/functions";
import { updateOne } from "../../core/utils/crudUtils";

const updateStaff = async (staff: Staff): Promise<Staff> => {
  const staffImg = staff.img_url;
  // console.log(staff);
  const staff_data_form = {
    ...staff,
  };

  const formData = new FormData();

  // check if the staff image is a file, it its not then dont do upload of the img_url
  if (staffImg && staffImg instanceof File) {
    // rename file first
    const renamedFile: File = renameFile(
      staff.english_name as string,
      staffImg as File
    );

    const uploadImageObject = {
      file: renamedFile,
      key: `uploads/staff/img/${renamedFile.name}`,
      user: staff["english_name"],
    };

    // func to upload image
    const uploadImageData = await staffUploadFile(uploadImageObject);

    // delete staff_data_form.img_url;

    console.log(uploadImageData);

    // // append staff image
    if (uploadImageData.data?.url)
      // formData.append("img_url", uploadImageData.data.url);
      staff_data_form.img_url = uploadImageData.data.url;
  }

  formData.append("staff_json", JSON.stringify(staff_data_form));
  // else do nothing, dont append the img_url to the formData

  //bank card images
  if (staff.bank_card_images) {
    if (
      staff.bank_card_images.front &&
      staff.bank_card_images.front instanceof File
    )
      formData.append("bank_card_front", staff.bank_card_images.front);
    if (
      staff.bank_card_images.back &&
      staff.bank_card_images.back instanceof File
    )
      formData.append("bank_card_back", staff.bank_card_images.back);
  }
  delete staff.bank_card_images?.back;
  delete staff.bank_card_images?.front;

  // residence card
  // append residence card details
  if (staff.residence_card_details) {
    if (
      staff.residence_card_details.front &&
      staff.residence_card_details.front instanceof File
    )
      formData.append(
        "residence_card_front",
        staff.residence_card_details.front
      );
    if (
      staff.residence_card_details.back &&
      staff.residence_card_details.back instanceof File
    )
      formData.append("residence_card_back", staff.residence_card_details.back);
  }
  delete staff.residence_card_details?.front;
  delete staff.residence_card_details?.back;

  // get passport details.file and remove it from the staff passport_details object
  const passportDetailsFile = staff.passport_details?.file;

  // append passport details file
  if (passportDetailsFile) {
    if (
      staff.passport_details?.file &&
      staff.passport_details?.file instanceof File
    ) {
      formData.append("passport_file", passportDetailsFile);
    }
  }

  delete staff.passport_details?.file;

  // append licenses
  if (staff.licenses) {
    staff.licenses.forEach((license) => {
      formData.append("licenses", license.file);
    });
  }

  const { data } = await axiosInstance.put("/staff/update_staff", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // return {} as Staff;
  return data;
};

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateStaff, {
    onSuccess: (staff: Staff) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) =>
        updateOne(oldStaff, staff)
      );
    },
  });

  return { isUpdating: isLoading, updateStaff: mutateAsync };
}
