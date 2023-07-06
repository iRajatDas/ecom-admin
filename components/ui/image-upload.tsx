"use client";

import React, { FC, useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMouted] = useState(false);

  useEffect(() => {
    setIsMouted(true);
  }, []);

  const onUpload = (result: any) => onChange(result.info.secure_url);

  if (!isMounted) return null;

  return (
    <div>
      <div className="flex items-center mb-4 gap-4">
        {value.map((url) => (
          <div
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            key={url}
          >
            <div className="z-10 top-2 right-2 absolute ">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                size={"icon"}
                variant={"destructive"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill src={url} alt="Image" className="object-cover" />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="lcwsqdeg">
        {({ open }) => {
          function onClick(e: any) {
            e.preventDefault();
            open();
          }
          return (
            <Button type="button" disabled={disabled} onClick={onClick}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
