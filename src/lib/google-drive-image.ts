/** Reliable Google Drive image URLs for Next.js and external embedding. */
export function getGoogleDriveImageUrl(fileId: string, width = 1600): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

export function getGoogleDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}
