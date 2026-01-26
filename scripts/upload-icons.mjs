import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FaEnvelope,
  FaFacebookMessenger,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary env vars.");
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

const icons = [
  { key: "whatsapp", Component: FaWhatsapp },
  { key: "telegram", Component: FaTelegramPlane },
  { key: "messenger", Component: FaFacebookMessenger },
  { key: "email", Component: FaEnvelope },
];

const toDataUri = (svg) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const uploadIcon = async (key, Component) => {
  const svg = renderToStaticMarkup(
    React.createElement(Component, { size: 96, color: "#ffffff" })
  );
  const result = await cloudinary.uploader.upload(toDataUri(svg), {
    folder: "widget_icons",
    public_id: `botrix_${key}`,
    resource_type: "image",
    overwrite: true,
  });
  return result.secure_url;
};

const run = async () => {
  const entries = await Promise.all(
    icons.map(async ({ key, Component }) => [key, await uploadIcon(key, Component)])
  );
  console.log("Cloudinary icon URLs:");
  entries.forEach(([key, url]) => {
    console.log(`${key}: ${url}`);
  });
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

