import axios from 'axios';
import { Licenses } from '../staff/types/staff';

async function downloadFileFromAWS(link: string): Promise<File | null> {
  try {
    const response = await axios.get(link, {
      responseType: 'blob', // Set responseType to 'blob'
    });

    const fileBlob = new Blob([response.data]);
    const fileName = response.headers['content-disposition']
      ? response.headers['content-disposition'].split('filename=')[1]
      : link.split('/').pop() || '';

    const file = new File([fileBlob], fileName);

    return file;
  } catch (error) {
    console.error('Error downloading the file:', error);
    return null;
  }
}

// export async function processLicenses(licenses: Licenses[]) {
//     const licensesFilePromises = licenses.map(async (license) => {
//         // check if license.file is a File object
        
        
//         if (license.file instanceof File) {
//             return license.file;
//         }else {
//             return downloadFileFromAWS(license.file as string);
//         }
      
//     });
  
//     const licensesFilePromisesResolved = await Promise.all(licensesFilePromises);
  
//     // Now, licensesFilePromisesResolved contains the actual files
//     const licensesFile = licensesFilePromisesResolved.filter(file => file !== null);
  
//     return licensesFile;
//   }

export async function processLicenses(licenses: Licenses[]) {
    const licensesFilePromises = licenses.map(async (license) => {
      if (license.file instanceof File) {
        // If license.file is already a File object, return it as is
        return license;
      } else {
        // Otherwise, download the file using downloadFileFromAWS
        return {
          ...license,
          file: await downloadFileFromAWS(license.file),
        };
      }
    });
  
    const licensesWithFiles = await Promise.all(licensesFilePromises);
  
    return licensesWithFiles;
  }
  