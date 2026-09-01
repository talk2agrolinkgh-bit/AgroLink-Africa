// src/lib/cloudinary.ts
// Direct browser-to-Cloudinary uploads via an unsigned upload preset — no
// server round-trip or API secret needed. This is the standard pattern for
// letting untrusted clients (a public "List Your Product" form, for
// instance) upload media without exposing signed credentials.
//
// Setup: Cloudinary dashboard → Settings → Upload → Add upload preset →
// Signing Mode: Unsigned → note the preset name. Both env vars below are
// intentionally NEXT_PUBLIC_ — an unsigned preset is designed to be called
// from the browser, and Cloudinary lets you restrict it by folder, file
// type, and size on their end if needed.

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);

export type MediaKind = "image" | "video" | "document";

const RESOURCE_TYPE: Record<MediaKind, string> = {
  image: "image",
  video: "video",
  document: "raw", // PDFs/docs — the upload preset must allow raw uploads
};

/**
 * Uploads a single file directly to Cloudinary and resolves with its
 * `secure_url`. Uses XHR (not fetch) so upload progress can be reported.
 */
export function uploadToCloudinary(
  file: File,
  kind: MediaKind,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error("Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.")
    );
  }

  const resourceType = RESOURCE_TYPE[kind];
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET as string);
    formData.append("folder", "agrolink"); // keeps demo/prod uploads easy to find in the Cloudinary console

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url as string);
        } catch {
          reject(new Error("Unexpected response from Cloudinary."));
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status}). Check the upload preset exists and is set to Unsigned.`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.send(formData);
  });
}
