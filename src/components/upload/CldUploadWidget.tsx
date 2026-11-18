"use client"

import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';
import type {
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { toast } from 'sonner';
import { brand } from "@/lib/brand";
import { useState } from 'react';


interface UploadedImage {
  url: string
  publicId: string
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
              window: brand.colors.white, windowBorder: brand.colors.ivory100, tabIcon: brand.colors.forest700,
              menuIcons: brand.colors.forest700, textDark: brand.colors.ink900, textLight: brand.colors.white,
              link: brand.colors.forest700, action: brand.colors.forest700, inactiveTabIcon: brand.colors.muted500,
              error: brand.colors.danger, inProgress: brand.colors.forest700, complete: brand.colors.success,
              sourceBg: brand.colors.ivory50,
            },
            frame: { borderRadius: "24px" },
          },
        }}

    onSuccess={(result: CloudinaryUploadWidgetResults) => {
      const info = result.info;
      if (!info || typeof info === "string") {
        return;
      }

      toast.success("Image uploaded successfully")
      setImages(prev => [...prev, { url: info.secure_url, publicId: info.public_id }])
    }}

    onQueuesEnd={(_, { widget }) => {
      widget.close()
    }}

    onError={(error: CloudinaryUploadWidgetError) => {
      const message = typeof error === "string" ? error : error?.statusText;
      toast.error(message || "Image upload failed")
    }}

    >
      {({ open }) => {
        return (
          <button
          type='button'
          onClick={() => open()}
          className="bg-forest-600 text-sm font-semibold rounded-lg p-2"
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
              <Image
                src={img.url}
                alt={`Upload ${i + 1}`}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover"
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