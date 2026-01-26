import { z } from "zod";

const colorString = z.string().min(1).max(30);

export const widgetInputSchema = z.object({
  name: z.string().min(1).max(80),
  platform: z.enum(["whatsapp", "telegram", "messenger", "email"]),
  contact: z.object({
    phone: z.string().max(40).optional().default(""),
    username: z.string().max(60).optional().default(""),
    pageId: z.string().max(60).optional().default(""),
    email: z.string().max(120).optional().default(""),
    subject: z.string().max(120).optional().default(""),
  }),
  defaultMessage: z.string().max(400).default(""),
  bubble: z.object({
    size: z.object({
      width: z.number().min(44).max(140),
      height: z.number().min(44).max(140),
    }),
    shape: z.enum(["circle", "rounded"]),
    iconSize: z.number().min(18).max(72),
    iconColor: colorString,
    backgroundColor: colorString,
    position: z.enum(["bottom-right", "bottom-left", "custom"]),
    offsetX: z.number().min(0).max(120),
    offsetY: z.number().min(0).max(120),
    shadow: z.boolean(),
  }),
  widget: z.object({
    width: z.number().min(240).max(480),
    height: z.number().min(280).max(640),
    headerBgColor: colorString,
    headingText: z.string().min(1).max(80),
    statusText: z.string().max(80),
    profileImage: z.string().max(300).optional().default(""),
    greetingText: z.string().max(220),
    inputPlaceholder: z.string().max(80),
    buttonColor: colorString,
    fontSize: z.number().min(12).max(20),
  }),
});

