export interface ArchiveFile {
  key: string; // The key (path + file name) of the file in the bucket
  name: string; // The name of the file
  size: number; // The size of the file in bytes
  type: string;
  lastModified: string; // The last modified date of the file
  eTag: string; // The entity tag (ETag) of the file, which can be used to check for modifications
  mimeType?: string; // Optional MIME type of the file, if applicable
  // Additional properties as needed
  createdBy: string;
  lastModifiedBy: string;
}

export interface ArchiveFolder {
  name: string;
  files: ArchiveFile[];
  subFolders?: ArchiveFolder[];
}

export interface PathEntry {
  name: string;
  path: string;
}
