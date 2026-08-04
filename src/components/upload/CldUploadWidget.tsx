"use client"

import { CldUploadWidget } from 'next-cloudinary';

function CloudinaryUploadWidget() {
  return (
    <CldUploadWidget 
    uploadPreset="real-listings-images"
    options={{
    styles: {
      palette: {
        window: "#FFFFFF",
        windowBorder: "#E5E7EB",
        tabIcon: "#114b3d",
        menuIcons: "#114b3d",
        textDark: "#111827",
        textLight: "#FFFFFF",
        link: "#114b3d",
        action: "#114b3d",
        inactiveTabIcon: "#6B7280",
        error: "#DC2626",
        inProgress: "#114b3d",
        complete: "#16A34A",
        sourceBg: "#F9FAFB",
      },
      frame: {
        borderRadius: "24px",
      },
      },
    }}
    >
      {({ open, error }) => {
        return (
          <button 
          onClick={() => open()}
          className="bg-[#155d4c] text-sm font-semibold rounded-lg"
          >
            Upload Listing Images
          </button>
        );
      }}
    </CldUploadWidget>
  );
}


export default CloudinaryUploadWidget