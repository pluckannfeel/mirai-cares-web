export function isFile(fileName: string): boolean {
  // A file is considered to be a file if it has an extension after the last dot
  const lastDotIndex = fileName.lastIndexOf(".");
  // Check if there's a dot, and it's not the first character (hidden files in Unix-like systems)
  const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;
  return hasExtension;
}

export enum FileType {
  File = "file",
  Folder = "folder",
  Image = "image",
}

export function getFileType(fileName: string): FileType {
  // A file is considered to be a folder if it does not have an extension
  const lastDotIndex = fileName.lastIndexOf(".");
  const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;

  if (!hasExtension) {
    return FileType.Folder;
  }

  // List of image file extensions
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
  ];
  const extension = fileName.slice(lastDotIndex).toLowerCase();

  if (imageExtensions.includes(extension)) {
    return FileType.Image;
  }

  return FileType.File;
}

export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// file type japanese english conversion
export function fileTypeConversion(type: string, locale: string = "en") {
  if (locale === "en") return type;

  switch (type) {
    case "image":
      return "画像";
    case "pdf":
      return "PDF";
    case "document":
      return "ドキュメント";
    case "spreadsheet":
      return "スプレッドシート";
    case "text":
      return "テキスト";
    case "csv":
      return "CSV";
    case "archive":
      return "アーカイブ";
    case "presentation":
      return "プレゼンテーション";
    case "audio":
      return "音声";
    case "folder":
      return "フォルダ";
    default:
      return "ファイル";
  }
}

export function formatLastModifiedby(
  fileType: string,
  lastModifiedBy: string,
  locale = "en"
) {
  if (fileType === "folder") {
    if (lastModifiedBy !== "unknown") return lastModifiedBy;
    else return "";
  }

  if (lastModifiedBy !== "unknown") return lastModifiedBy;

  if (locale === "en") return "unknown";

  if (locale === "ja") return "不明";
}

export const archiveLists = [
  {
    label: "archive.list.archiveLibrary",
    value: "archive/",
  },
  {
    label: "archive.list.staffDocuments",
    value: "uploads/staff/",
  },
];
