import {
  S3Client,
  PutObjectCommand,
  // GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
type EventArg<T extends Record<string, any>> = {
  event: {
    backgroundColor: string;
    extendedProps: T;
  };
};

type uploadFileProps = {
  file: File;
  key: string;
  user?: string;
};

type APIResponse = {
  code: string;
  message: string;
  data?: Record<string, string>;
};

export const getGenderColor = <T extends Record<string, any>>(
  gender: string,
  arg: EventArg<T>
) => {
  switch (gender) {
    case "female":
      return "#FA5252"; // Yellow for Female
    case "male":
      // return "#7FBCD2"; // Blue for Male
      return "#15AABF";
    case "other":
      // baby pink for other
      return "#C0D1B0";
    // return ; // Red for Other
    default:
      return arg.event.backgroundColor;
  }
};

export const trimStringWithEllipsis = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

export const renameFile = (userName: string, file: File): File => {
  // Get the current date and time
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Extract the first name
  const firstName = userName.split(" ")[0];

  // Get the file extension
  const fileExtension = file.name.split(".").pop();

  // Construct the new file name
  const newFileName = `${firstName}_${year}${month}${day}_${hours}${minutes}${seconds}.${fileExtension}`;

  // Create a new File object with the new name
  const renamedFile = new File([file], newFileName, { type: file.type });

  return renamedFile;
};

export const staffUploadFile = async ({
  file,
  key,
  user,
}: uploadFileProps): Promise<APIResponse> => {
  // Step 1: Generate a presigned URL for PUT
  const putUrl = await generatePresignedPutUrl({ file, key, user });

  if (putUrl) {
    // Step 2: Upload the file using the presigned URL
    const success = await uploadFileUsingPresignedUrl(putUrl, file);
    if (success) {
      // Step 3: Generate a presigned URL for GET
      const getUrl = await generatePresignedGetUrl({ key });

      return {
        code: "success",
        message: "File uploaded successfully",
        data: { url: getUrl } as Record<string, string>,
      };
    } else {
      return { code: "error", message: "File upload failed" };
    }
  } else {
    return { code: "error", message: "Failed to generate a presigned URL" };
  }
};

// Function to generate presigned PUT URL
const generatePresignedPutUrl = async ({
  // file,
  key: currentPath,
  user: userName,
}: uploadFileProps) => {
  const client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEYID as string,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESSKEY as string,
    },
  });

  const bucket = "ews-bucket";
  // const key = `${currentPath}${file.name}`;
  const key = currentPath;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Metadata: {
      last_modified_by: userName || "unknown",
    },
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
};

// Function to generate presigned GET URL
// const generatePresignedGetUrl = async ({ key }: { key: string }) => {
//   const client = new S3Client({
//     region: "ap-northeast-1",
//     credentials: {
//       accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEYID as string,
//       secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESSKEY as string,
//     },
//   });

//   const bucket = "ews-bucket";

//   const command = new GetObjectCommand({
//     Bucket: bucket,
//     Key: key,
//   });

//   try {
//     const url = await getSignedUrl(client, command, { expiresIn: 3600 });
//     return url;
//   } catch (error) {
//     console.error("Error generating presigned GET URL:", error);
//     return null;
//   }
// };

// Function to generate presigned GET URL
const generatePresignedGetUrl = async ({ key }: { key: string }) => {
  const bucket = "ews-bucket";
  const region = "ap-northeast-1";

  try {
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    console.error("Error generating URL:", error);
    return null;
  }
};

const uploadFileUsingPresignedUrl = async (url: string, file: File) => {
  try {
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return response.status === 200;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("File upload failed:", error.response?.data);
    return false;
  }
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  console.log(name)
  return {
    sx: {
      bgcolor: stringToColor(name),
      mr: 3,
      width: 50,
      height: 50,
    },
    // children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
