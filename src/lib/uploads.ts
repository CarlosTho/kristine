import { randomBytes } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_BYTES = 3 * 1024 * 1024;

const TYPES = [
  { mime: "image/jpeg", ext: "jpg", magic: [0xff, 0xd8, 0xff] },
  { mime: "image/png", ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", ext: "webp", magic: [0x52, 0x49, 0x46, 0x46] },
] as const;

function detectType(buffer: Buffer, claimedType: string) {
  return TYPES.find((type) => {
    if (type.mime !== claimedType) return false;
    if (type.ext === "webp") {
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).equals(Buffer.from("RIFF")) &&
        buffer.subarray(8, 12).equals(Buffer.from("WEBP"))
      );
    }
    return type.magic.every((byte, index) => buffer[index] === byte);
  });
}

export async function saveImageUpload(file: File, kind: "cover" | "section" | "portrait") {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 3MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const type = detectType(buffer, file.type);
  if (!type) {
    throw new Error("Use a JPG, PNG, or WEBP image.");
  }

  const filename = `${kind}-${randomBytes(16).toString("hex")}.${type.ext}`;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from("media").upload(filename, new Uint8Array(buffer), {
    contentType: type.mime,
    upsert: false,
  });

  if (error) {
    throw new Error("Upload failed.");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(filename);
  return data.publicUrl;
}
