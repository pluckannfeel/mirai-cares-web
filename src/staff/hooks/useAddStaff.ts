import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Staff } from "../types/staff";
import { axiosInstance } from "../../api/server";
import { renameFile, staffUploadFile } from "../helpers/functions";

const addStaff = async (staff: Staff): Promise<Staff> => {
  const staffImg = staff.img_url;

  const staff_data_form = {
    ...staff,
    // add licenses but remove the file from each license which is license.file
    // licenses: staff.licenses && staff.licenses.map((license) => license),
  };

  delete staff_data_form.img_url;

  const formData = new FormData();

  if (staffImg && staffImg instanceof File) {
    const renamedFile: File = renameFile(
      staff.english_name as string,
      staffImg as File
    );

    const uploadImageObject = {
      file: renamedFile,
      key: `uploads/staff/img/${renamedFile.name}`,
      user: staff["english_name"],
    };

    const uploadImageData = await staffUploadFile(uploadImageObject);

    if (uploadImageData.data?.url)
      staff_data_form.img_url = uploadImageData.data.url;
  }

  // if (staffImg) formData.append("staff_image", staffImg);

  // append bank card images
  if (staff.bank_card_images) {
    // const bankCardImages = {
    //   front: "",
    //   back: "",
    // } as BankCardImage;
    if (
      staff.bank_card_images.front &&
      staff.bank_card_images.front instanceof File
    ) {
      const renamedBankFile: File = renameFile(
        staff.english_name as string,
        staff.bank_card_images?.front
      );

      const uploadImageObject = {
        file: renamedBankFile,
        key: `uploads/staff/bank_img/${renamedBankFile.name}`,
        user: staff["english_name"],
      };

      const uploadImageData = await staffUploadFile(uploadImageObject);

      if (uploadImageData.data?.url && staff_data_form.bank_card_images) {
        staff_data_form.bank_card_images.front = uploadImageData.data.url;
        // bankCardImages.front = uploadImageData.data.url;
      }
    }
    // formData.append("bank_card_front", staff.bank_card_images.front);

    if (
      staff.bank_card_images.back &&
      staff.bank_card_images.back instanceof File
    ) {
      const renamedBankFile: File = renameFile(
        staff.english_name as string,
        staff.bank_card_images?.back
      );

      const uploadImageObject = {
        file: renamedBankFile,
        key: `uploads/staff/bank_img/${renamedBankFile.name}`,
        user: staff["english_name"],
      };

      const uploadImageData = await staffUploadFile(uploadImageObject);

      if (uploadImageData.data?.url && staff_data_form.bank_card_images) {
        staff_data_form.bank_card_images.back = uploadImageData.data.url;
        // bankCardImages.back = uploadImageData.data.url;
      }
    }
    // formData.append("bank_card_back", staff.bank_card_images.back);

    // staff_data_form.bank_card_images = bankCardImages;
  }

  // delete staff.bank_card_images?.back;
  // delete staff.bank_card_images?.front;

  // append residence card details
  if (staff.residence_card_details) {
    if (
      staff.residence_card_details.front &&
      staff.residence_card_details.front instanceof File
    ) {
      const renamedResFile: File = renameFile(
        staff.english_name as string,
        staff.residence_card_details?.front
      );

      const uploadImageObject = {
        file: renamedResFile,
        key: `uploads/staff/residencecard_img/${renamedResFile.name}`,
        user: staff["english_name"],
      };

      const uploadImageData = await staffUploadFile(uploadImageObject);

      if (
        uploadImageData.data?.url &&
        staff_data_form.residence_card_details?.front
      ) {
        staff_data_form.residence_card_details.front = uploadImageData.data.url;
      }

      // formData.append(
      //   "residence_card_front",
      //   staff.residence_card_details.front
      // );
    }

    if (
      staff.residence_card_details.back &&
      staff.residence_card_details.back instanceof File
    ) {
      const renamedResFile: File = renameFile(
        staff.english_name as string,
        staff.residence_card_details?.back
      );

      const uploadImageObject = {
        file: renamedResFile,
        key: `uploads/staff/residencecard_img/${renamedResFile.name}`,
        user: staff["english_name"],
      };

      const uploadImageData = await staffUploadFile(uploadImageObject);

      if (
        uploadImageData.data?.url &&
        staff_data_form.residence_card_details?.back
      ) {
        staff_data_form.residence_card_details.back = uploadImageData.data.url;
      }
      // formData.append("residence_card_back", staff.residence_card_details.back);
    }
  }
  // delete staff.residence_card_details?.front;
  // delete staff.residence_card_details?.back;

  // get passport details.file and remove it from the staff passport_details object
  const passportDetailsFile = staff.passport_details?.file;

  // append passport details file
  if (passportDetailsFile) {
    if (staff.passport_details?.file && passportDetailsFile instanceof File) {
      // formData.append("passport_file", passportDetailsFile);
      const renamedPassportFile: File = renameFile(
        staff.english_name as string,
        passportDetailsFile
      );

      const uploadImageObject = {
        file: renamedPassportFile,
        key: `uploads/staff/passport_img/${renamedPassportFile.name}`,
        user: staff["english_name"],
      };

      const uploadImageData = await staffUploadFile(uploadImageObject);

      if (uploadImageData.data?.url && staff_data_form.passport_details) {
        staff_data_form.passport_details.file = uploadImageData.data.url;
      }
    }
  }

  // delete staff.passport_details?.file;

  // append licenses
  if (staff.licenses) {
    staff.licenses.forEach(async (license) => {
      formData.append("licenses", license.file);
      // const licenseFile = license.file;

      // if (licenseFile instanceof File) {
      //   const renamedLicenseFile: File = renameFile(
      //     staff.english_name as string,
      //     licenseFile
      //   );

      //   const uploadImageObject = {
      //     file: renamedLicenseFile,
      //     key: `uploads/staff/license_img/l${index}${renamedLicenseFile.name}`,
      //     user: staff["english_name"],
      //   };

      //   const uploadImageData = await staffUploadFile(uploadImageObject);

      //   if (uploadImageData.data?.url) {
      //     license.file = uploadImageData.data.url;
      //   }
      // }
    });
  }

  formData.append("staff_json", JSON.stringify(staff_data_form));

  const { data } = await axiosInstance.post("/staff/add_staff", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;

  // return {} as Staff;
};
export function useAddStaff() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addStaff, {
    onSuccess: (staff: Staff) => {
      // console.log(staff)
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) =>
        addOne(oldStaff, staff)
      );
    },
  });

  return { isAdding: isLoading, addStaff: mutateAsync };
}
