"use client"

import { CldUploadWidget } from 'next-cloudinary';
import { toast } from 'sonner';
import { useState } from 'react';


interface UploadedImage {
  url: string
  publicId: String | any
}

function CloudinaryUploadWidget() {
  const [images, setImages] = useState<UploadedImage[]>([])

  const removeImage = (publicId: string) => {
    setImages(prev=>prev.filter(img=>img.publicId !== publicId));
  }

  return (

     <div className="col-span-full space-y-3">
      {/* Hidden inputs — submitted with the parent <form> */}
      {images.map((img) => (
        <input
          key={`url_${img.publicId}`}
          type="hidden"
          name="imageUrls"
          value={img.url}
        />
      ))}
      {images.map((img) => (
        <input
          key={`pid_${img.publicId}`}
          type="hidden"
          name="imagePublicIds"
          value={img.publicId}
        />
      ))}


    <CldUploadWidget 
    uploadPreset="real-listings-images"
    options={{
          styles: {
            palette: {
              window: "#FFFFFF", windowBorder: "#E5E7EB", tabIcon: "#114b3d",
              menuIcons: "#114b3d", textDark: "#111827", textLight: "#FFFFFF",
              link: "#114b3d", action: "#114b3d", inactiveTabIcon: "#6B7280",
              error: "#DC2626", inProgress: "#114b3d", complete: "#16A34A",
              sourceBg: "#F9FAFB",
            },
            frame: { borderRadius: "24px" },
          },
        }}

    onSuccess={( result, {widget} ) => {
      console.log("Cloudinary Result:",  result)
      toast.success("Image uploaded successfully")
    }}

    onQueuesEnd={( result, { widget }) => {
      console.log("All Uploads complete")
      widget.close()
    }}

    onError={(error: any, {widget}) => {
      console.log("Cloudinary Error: ", error)
      toast.error(error.toString() || "Image upload failed")
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

    {/* Image previews with remove button */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <div key={img.publicId} className="relative group">
              <img
                src={img.url}
                alt={`Upload ${i + 1}`}
                className="h-20 w-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center rounded-b-lg py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default CloudinaryUploadWidget