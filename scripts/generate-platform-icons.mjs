import { writeFileSync } from "fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FaEnvelope,
  FaFacebookMessenger,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

const icons = {
  whatsapp: FaWhatsapp,
  telegram: FaTelegramPlane,
  messenger: FaFacebookMessenger,
  email: FaEnvelope,
};

const platformIconSvgs = Object.fromEntries(
  Object.entries(icons).map(([key, Icon]) => [
    key,
    renderToStaticMarkup(createElement(Icon)),
  ])
);

const fileContents = `export const platformIconSvgs = ${JSON.stringify(
  platformIconSvgs,
  null,
  2
)} as const;\n`;

writeFileSync("src/lib/platformIconSvgs.ts", fileContents);

