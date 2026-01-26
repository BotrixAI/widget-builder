import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

const MAX_PROFILE_UPLOAD_BYTES = Number(
  process.env.MAX_PROFILE_UPLOAD_BYTES || 2_000_000
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const dataUrl =
    typeof payload === "object" && payload !== null && "dataUrl" in payload
      ? (payload as { dataUrl?: unknown }).dataUrl
      : null;

  if (!dataUrl || typeof dataUrl !== "string") {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 });
  }

  if (
    !dataUrl.startsWith("data:image/") ||
    !dataUrl.includes(";base64,")
  ) {
    return NextResponse.json(
      { error: "Invalid image format" },
      { status: 400 }
    );
  }

  const commaIndex = dataUrl.indexOf(",");
  const base64Body = commaIndex === -1 ? "" : dataUrl.slice(commaIndex + 1);
  const approxBytes = Math.ceil((base64Body.length * 3) / 4);
  if (approxBytes > MAX_PROFILE_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Image exceeds size limit" },
      { status: 413 }
    );
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    );
  }

  try {
    const upload = await cloudinary.uploader.upload(dataUrl, {
      folder: "widget_profiles",
      resource_type: "image",
    });

    return NextResponse.json({ url: upload.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

