/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { APIRequestResponse } from "../types/archive";
// import { axiosInstance } from "../../api/server";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

const generatePresignedUrlPost = async ({
  file,
  currentPath,
  userName,
}: {
  file: File;
  currentPath: string;
  userName?: string;
}) => {
  const client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: "",
      secretAccessKey: "",
    },
  });
  const bucket = "ews-bucket";
  const key = `${currentPath}${file.name}`;
  const Conditions = [{ acl: "public-read" }];
  const Fields = {
    acl: "public-read",
    // "Content-Type": file.type,
    // username as metadata
    // "x-amz-meta-last_modified_by": userName || "unknown",
  };

  console.log("Generating presigned URL...");

  const response = await createPresignedPost(client, {
    Bucket: bucket,
    Key: key,
    Conditions,
    Fields,
    Expires: 60,
  });

  if (!response.url) {
    console.error("Presigned URL generation failed:", response);
    return null;
  }

  return {
    url: response.url,
    fields: response.fields,
  };
};

// Presigned URL received from the server
// type Payload = {
//   url: string;
//   fields: {
//     key: string;
//     AWSAccessKeyId: string;
//     Policy: string;
//     // signature: string;
//     // X-Amz-Signature: string;
//   };
// };

// Function to upload the file using the presigned URL
const uploadFileUsingPresignedUrl = async (payload: any, file: File) => {
  console.log("Starting file upload to presigned URL...");
  console.log(payload);

  // const formData = new FormData();
  // formData.append("key", payload.fields.key);
  // // formData.append("AWSAccessKeyId", payload.fields.AWSAccessKeyId);
  // formData.append(
  //   "AWSAccessKeyId",
  //   payload.fields["X-Amz-Credential"].split("/")[0]
  // );
  // formData.append("policy", payload.fields["Policy"]);
  // formData.append("signature", payload.fields["X-Amz-Signature"]);
  // formData.append("file", file);

  const response = await axios.post(payload.url, formData);

  if (response.status === 204) {
    console.log("File uploaded successfully to S3.");
  } else {
    console.error("File upload to S3 failed:", response.data);
    // console.log("Response data:", response.data);
  }

  return response;
};

// Function to request the presigned URL and upload the file
const requestPresignedUrlAndUploadFile = async ({
  file,
  currentPath,
  userName,
}: {
  file: File;
  currentPath: string;
  userName?: string;
}): Promise<APIRequestResponse> => {
  console.log("Requesting presigned URL from the server...");

  // Generate presigned URL
  const data = await generatePresignedUrlPost({ file, currentPath, userName });

  if (data) {
    // Upload the file using the presigned URL
    console.log("Uploading file to presigned URL...");
    await uploadFileUsingPresignedUrl(data, file);

    console.log("File upload process completed.");
    return { code: "success", message: "File uploaded successfully" };
  } else {
    return {
      code: "error",
      message: "File upload failed, presigned url wasnt generated",
    };
  }
};

// React hook to manage file upload
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync, isError } = useMutation(
    requestPresignedUrlAndUploadFile,
    {
      onSuccess: (response) => {
        if (response.code === "success") {
          console.log("File upload succeeded, invalidating queries...");
          queryClient.invalidateQueries("archive-current-files");
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // onError: (error: any) => {
      //   // console.error("File upload failed:", error);
      //   console.log(error.response.data);
      // },
    }
  );

  return {
    isUploading: isLoading,
    uploadFile: mutateAsync,
    isError,
  };
};
