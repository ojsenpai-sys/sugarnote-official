"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
}

export default function ImageUpload({ value, onChange, bucket = "images", folder = "uploads" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("画像を選択してください。");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" className="object-cover w-full h-full" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative w-48 h-48 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-500 bg-slate-50 flex flex-col items-center justify-center transition-colors">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500 font-medium">画像を選択</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      )}
      {value && <p className="text-xs text-slate-400 truncate max-w-xs">{value}</p>}
    </div>
  );
}
