"use client";

import { useMemo, useState, type ReactElement } from "react";
import {
  FaEnvelope,
  FaFacebookMessenger,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import type { WidgetConfig, WidgetPlatform } from "@/types/widget";

type DesignerTab = "bubble" | "widget";

const platformDefaults: Record<WidgetPlatform, WidgetConfig> = {
  whatsapp: {
    name: "WhatsApp Widget",
    platform: "whatsapp",
    contact: { phone: "" },
    defaultMessage: "Hi!",
    bubble: {
      size: { width: 64, height: 64 },
      shape: "circle",
      iconSize: 28,
      iconColor: "#ffffff",
      backgroundColor: "#25D366",
      position: "bottom-right",
      offsetX: 24,
      offsetY: 24,
      shadow: true,
    },
    widget: {
      width: 320,
      height: 420,
      headerBgColor: "#25D366",
      headingText: "Chat with us",
      statusText: "Typically replies fast",
      profileImage: "",
      greetingText: "Hey there! 👋 How can we help?",
      inputPlaceholder: "Type your message...",
      buttonColor: "#25D366",
      fontSize: 14,
    },
  },
  telegram: {
    name: "Telegram Widget",
    platform: "telegram",
    contact: { username: "your_telegram" },
    defaultMessage: "Hi! I’d love to learn more.",
    bubble: {
      size: { width: 64, height: 64 },
      shape: "circle",
      iconSize: 28,
      iconColor: "#ffffff",
      backgroundColor: "#2AABEE",
      position: "bottom-right",
      offsetX: 24,
      offsetY: 24,
      shadow: true,
    },
    widget: {
      width: 320,
      height: 420,
      headerBgColor: "#229ED9",
      headingText: "Message us on Telegram",
      statusText: "Online now",
      profileImage: "",
      greetingText: "Hi! We’re here to help.",
      inputPlaceholder: "Type your message...",
      buttonColor: "#2AABEE",
      fontSize: 14,
    },
  },
  messenger: {
    name: "Messenger Widget",
    platform: "messenger",
    contact: { pageId: "yourpage" },
    defaultMessage: "Hi! I want to connect.",
    bubble: {
      size: { width: 64, height: 64 },
      shape: "circle",
      iconSize: 28,
      iconColor: "#ffffff",
      backgroundColor: "#0084FF",
      position: "bottom-right",
      offsetX: 24,
      offsetY: 24,
      shadow: true,
    },
    widget: {
      width: 320,
      height: 420,
      headerBgColor: "#0084FF",
      headingText: "Chat on Messenger",
      statusText: "Usually replies in minutes",
      profileImage: "",
      greetingText: "Hello! Let's chat.",
      inputPlaceholder: "Type your message...",
      buttonColor: "#0062D6",
      fontSize: 14,
    },
  },
  email: {
    name: "Email Widget",
    platform: "email",
    contact: { email: "hello@example.com", subject: "Support request" },
    defaultMessage: "Hi! I’d like to know more.",
    bubble: {
      size: { width: 64, height: 64 },
      shape: "circle",
      iconSize: 28,
      iconColor: "#ffffff",
      backgroundColor: "#0F172A",
      position: "bottom-right",
      offsetX: 24,
      offsetY: 24,
      shadow: true,
    },
    widget: {
      width: 320,
      height: 420,
      headerBgColor: "#1F2937",
      headingText: "Email our team",
      statusText: "We reply within 24 hours",
      profileImage: "",
      greetingText: "Drop us a line anytime.",
      inputPlaceholder: "Type your message...",
      buttonColor: "#0F172A",
      fontSize: 14,
    },
  },
};

const platformIcons: Record<WidgetPlatform, ReactElement> = {
  whatsapp: <FaWhatsapp />,
  telegram: <FaTelegramPlane />,
  messenger: <FaFacebookMessenger />,
  email: <FaEnvelope />,
};

const copyToClipboard = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";

const brandingLogo =
  process.env.NEXT_PUBLIC_BRANDING_LOGO ||
  "https://dummyimage.com/64x64/0f172a/ffffff&text=B";
const brandingLink =
  process.env.NEXT_PUBLIC_BRANDING_LINK || "https://botrix.ai";

const buildEmbedCode = (widgetId: string) =>
  `<script src="${appUrl}/widget.js" data-widget-id="${widgetId}" async></script>`;

function WidgetPreview({ config }: { config: WidgetConfig }) {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");

  const bubblePosition = useMemo(() => {
    return config.bubble.position === "bottom-left"
      ? { left: config.bubble.offsetX, right: "auto" }
      : { right: config.bubble.offsetX, left: "auto" };
  }, [config.bubble.offsetX, config.bubble.position]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div
        className="absolute"
        style={{
          bottom: config.bubble.offsetY,
          ...bubblePosition,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center justify-center transition"
          style={{
            width: config.bubble.size.width,
            height: config.bubble.size.height,
            borderRadius: config.bubble.shape === "circle" ? 999 : 18,
            background: config.bubble.backgroundColor,
            color: config.bubble.iconColor,
            boxShadow: config.bubble.shadow
              ? "0 12px 24px rgba(15, 23, 42, 0.18)"
              : "none",
          }}
        >
          <span style={{ fontSize: config.bubble.iconSize }}>
            {platformIcons[config.platform]}
          </span>
        </button>
      </div>

      {open && (
        <div
          className="absolute overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{
            width: "min(92vw, " + config.widget.width + "px)",
            height: "min(70vh, " + config.widget.height + "px)",
            bottom: "min(24px, " + (config.bubble.offsetY + config.bubble.size.height + 16) + "px)",
            ...bubblePosition,
            fontSize: config.widget.fontSize,
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{ background: config.widget.headerBgColor }}
          >
            <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20">
              {config.widget.profileImage ? (
                <img
                  src={config.widget.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">
                  {platformIcons[config.platform]}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {config.widget.headingText}
              </p>
              <p className="text-xs text-white/80">
                {config.widget.statusText}
              </p>
            </div>
          </div>
          <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-3 text-slate-900">
            <div className="max-w-[85%] rounded-2xl bg-white p-3 shadow-sm">
              {config.widget.greetingText}
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={config.widget.inputPlaceholder}
              className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none"
            />
            <button
              type="button"
              className="h-10 rounded-lg px-4 text-sm font-semibold text-white"
              style={{ background: config.widget.buttonColor }}
            >
              Send
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-white py-2 text-[11px] text-slate-500">
            <span>Powered by</span>
            <a href={brandingLink} target="_blank" rel="noreferrer">
              <img
                src={brandingLogo}
                alt="Powered by logo"
                className="h-5 w-5 object-contain"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [platform, setPlatform] = useState<WidgetPlatform>("whatsapp");
  const [designerTab, setDesignerTab] = useState<DesignerTab>("bubble");
  const [config, setConfig] = useState<WidgetConfig>(
    platformDefaults.whatsapp
  );
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string>("");

  const embedCode = widgetId ? buildEmbedCode(widgetId) : "";

  const updateConfig = (updater: (value: WidgetConfig) => WidgetConfig) => {
    setConfig((prev) => updater({ ...prev }));
  };

  const validateConfig = () => {
    if (!config.name.trim()) {
      return "Widget name is required.";
    }
    if (!config.widget.headingText.trim()) {
      return "Widget title is required.";
    }
    if (config.platform === "whatsapp" && !config.contact.phone?.trim()) {
      return "WhatsApp number is required.";
    }
    if (config.platform === "telegram" && !config.contact.username?.trim()) {
      return "Telegram username is required.";
    }
    if (config.platform === "messenger" && !config.contact.pageId?.trim()) {
      return "Messenger page ID is required.";
    }
    if (config.platform === "email" && !config.contact.email?.trim()) {
      return "Support email is required.";
    }
    return "";
  };

  const handlePlatformChange = (value: WidgetPlatform) => {
    setPlatform(value);
    setWidgetId(null);
    setConfig(platformDefaults[value]);
  };

  const handleProfileUpload = async (file: File | null) => {
    if (!file) {
      updateConfig((prev) => ({
        ...prev,
        widget: { ...prev.widget, profileImage: "" },
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setStatus("Uploading profile image...");
        const response = await fetch("/api/uploads/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: String(reader.result) }),
        });
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        const data = await response.json();
        updateConfig((prev) => ({
          ...prev,
          widget: { ...prev.widget, profileImage: data.url },
        }));
        setStatus("Profile image uploaded.");
      } catch (error) {
        setStatus("Profile upload failed. Please try again.");
      }
    };
    reader.readAsDataURL(file);
  };

  const saveWidget = async () => {
    const validationError = validateConfig();
    if (validationError) {
      setToast(validationError);
      setTimeout(() => setToast(""), 2500);
      return;
    }

    setStatus("Saving widget...");
    try {
      const response = await fetch(
        widgetId ? `/api/widgets/${widgetId}` : "/api/widgets",
        {
          method: widgetId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save");
      }
      const data = await response.json();
      setWidgetId(data.widgetId || widgetId);
      setStatus("Widget saved. Copy your embed code below.");
    } catch (error) {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      <div className="mx-auto w-[90%] px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Botrix Widgets
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              Social Chat Widget Builder
            </h1>
            <p className="max-w-xl text-lg text-slate-500">
              Design a branded chat bubble and widget UI, then embed it on any
              site with a single script tag.
            </p>
          </div>
          <button
            type="button"
            onClick={saveWidget}
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Get Embed Code
          </button>
        </div>
        {toast && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 shadow-sm">
            {toast}
          </div>
        )}

        <main className="grid grid-cols-1 gap-10 lg:grid-cols-[1.85fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Live Preview
                  </h2>
                  <p className="text-base text-slate-500">
                    Click the bubble to open the widget.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Preview
                </span>
              </div>
              <div className="mt-5 h-[72vh] max-h-[560px] min-h-[420px] rounded-2xl border border-slate-100 bg-slate-50">
                <WidgetPreview config={config} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-200/50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-base font-semibold text-slate-700">
                  Add this script in the html body to get the widget:
                </p>
                <button
                  type="button"
                  onClick={saveWidget}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Get Embed Code
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {status || "Save your widget to generate embed code."}
              </p>
                <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-sm text-slate-100 shadow-inner">
                <pre className="whitespace-pre-wrap">
                  {embedCode || "// Embed code will appear here"}
                </pre>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!embedCode) return;
                  await copyToClipboard(embedCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`mt-4 w-full rounded-full px-4 py-2 text-base font-semibold transition ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "border border-slate-200"
                }`}
                disabled={!embedCode}
              >
                {copied ? "Copied" : "Copy Embed Script"}
              </button>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex rounded-full bg-white/90 p-1 text-base shadow-lg shadow-slate-200/50">
                <button
                  type="button"
                  onClick={() => setDesignerTab("widget")}
                  className={`flex-1 rounded-full px-4 py-2 font-semibold ${
                    designerTab === "widget"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Widget
                </button>
                <button
                  type="button"
                  onClick={() => setDesignerTab("bubble")}
                  className={`flex-1 rounded-full px-4 py-2 font-semibold ${
                    designerTab === "bubble"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Icon
                </button>
              </div>
              <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-500 shadow-lg shadow-slate-200/50">
                Platform Setup
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-200/50">
                {designerTab === "widget" ? (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-base font-semibold">Widget Size</h2>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={config.widget.width}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              widget: {
                                ...prev.widget,
                                width: Number(event.target.value),
                              },
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          value={config.widget.height}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              widget: {
                                ...prev.widget,
                                height: Number(event.target.value),
                              },
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Title</h2>
                      <input
                        value={config.widget.headingText}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            widget: {
                              ...prev.widget,
                              headingText: event.target.value,
                            },
                          }))
                        }
                        className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Greeting</h2>
                      <input
                        value={config.widget.greetingText}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            widget: {
                              ...prev.widget,
                              greetingText: event.target.value,
                            },
                          }))
                        }
                        className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Status Text</h2>
                      <input
                        value={config.widget.statusText}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            widget: {
                              ...prev.widget,
                              statusText: event.target.value,
                            },
                          }))
                        }
                        className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Header Color</h2>
                      <input
                        type="color"
                        value={config.widget.headerBgColor}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            widget: {
                              ...prev.widget,
                              headerBgColor: event.target.value,
                            },
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Button Color</h2>
                      <input
                        type="color"
                        value={config.widget.buttonColor}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            widget: {
                              ...prev.widget,
                              buttonColor: event.target.value,
                            },
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">
                        Profile Image
                      </h2>
                      <div className="mt-3 grid gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleProfileUpload(
                              event.target.files?.[0] || null
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        />
                        <input
                          value={config.widget.profileImage}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              widget: {
                                ...prev.widget,
                                profileImage: event.target.value,
                              },
                            }))
                          }
                          placeholder="Profile image URL"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-base font-semibold">Icon Size</h2>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={config.bubble.size.width}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: {
                                ...prev.bubble,
                                size: {
                                  width: Number(event.target.value),
                                  height: Number(event.target.value),
                                },
                              },
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          value={config.bubble.size.height}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: {
                                ...prev.bubble,
                                size: {
                                  width: Number(event.target.value),
                                  height: Number(event.target.value),
                                },
                              },
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Shape</h2>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: { ...prev.bubble, shape: "circle" },
                            }))
                          }
                          className={`rounded-xl border px-3 py-2 text-sm ${
                            config.bubble.shape === "circle"
                              ? "border-emerald-500 text-emerald-600"
                              : "border-slate-200 text-slate-500"
                          }`}
                        >
                          Circle
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: { ...prev.bubble, shape: "rounded" },
                            }))
                          }
                          className={`rounded-xl border px-3 py-2 text-sm ${
                            config.bubble.shape === "rounded"
                              ? "border-emerald-500 text-emerald-600"
                              : "border-slate-200 text-slate-500"
                          }`}
                        >
                          Rounded
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Color</h2>
                      <div className="mt-3 grid gap-3">
                        <input
                          type="color"
                          value={config.bubble.backgroundColor}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: {
                                ...prev.bubble,
                                backgroundColor: event.target.value,
                              },
                            }))
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 px-3 py-2"
                        />
                        <input
                          type="color"
                          value={config.bubble.iconColor}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: {
                                ...prev.bubble,
                                iconColor: event.target.value,
                              },
                            }))
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-semibold">Position</h2>
                      <select
                        value={config.bubble.position}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            bubble: {
                              ...prev.bubble,
                              position: event.target.value as
                                | "bottom-right"
                                | "bottom-left"
                                | "custom",
                            },
                          }))
                        }
                        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="custom">Custom Offset</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="space-y-2 text-sm font-medium">
                        Offset X
                        <input
                          type="range"
                          min={0}
                          max={120}
                          value={config.bubble.offsetX}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: {
                                ...prev.bubble,
                                offsetX: Number(event.target.value),
                              },
                            }))
                          }
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Offset Y
                        <input
                          type="range"
                          min={0}
                          max={120}
                          value={config.bubble.offsetY}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              bubble: {
                                ...prev.bubble,
                                offsetY: Number(event.target.value),
                              },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <label className="flex items-center gap-3 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={config.bubble.shadow}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            bubble: {
                              ...prev.bubble,
                              shadow: event.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4"
                      />
                      Enable Shadow
                    </label>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-200/50">
                <h2 className="text-base font-semibold">Platform Setup</h2>
                <div className="mt-4 space-y-3">
                  <select
                    value={platform}
                    onChange={(event) =>
                      handlePlatformChange(
                        event.target.value as WidgetPlatform
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="messenger">Messenger</option>
                    <option value="email">Email</option>
                  </select>
                  <input
                    value={config.name}
                    onChange={(event) =>
                      updateConfig((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Widget name"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />

                  {platform === "whatsapp" && (
                    <input
                      value={config.contact.phone || ""}
                      onChange={(event) =>
                        updateConfig((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            phone: event.target.value,
                          },
                        }))
                      }
                      placeholder="Phone (e.g., +1...)"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                  {platform === "telegram" && (
                    <input
                      value={config.contact.username || ""}
                      onChange={(event) =>
                        updateConfig((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            username: event.target.value,
                          },
                        }))
                      }
                      placeholder="Telegram username"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                  {platform === "messenger" && (
                    <input
                      value={config.contact.pageId || ""}
                      onChange={(event) =>
                        updateConfig((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            pageId: event.target.value,
                          },
                        }))
                      }
                      placeholder="Facebook Page ID"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                  {platform === "email" && (
                    <>
                      <input
                        value={config.contact.email || ""}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              email: event.target.value,
                            },
                          }))
                        }
                        placeholder="Support email"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <input
                        value={config.contact.subject || ""}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              subject: event.target.value,
                            },
                          }))
                        }
                        placeholder="Email subject"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </>
                  )}
                  <textarea
                    value={config.defaultMessage}
                    onChange={(event) =>
                      updateConfig((prev) => ({
                        ...prev,
                        defaultMessage: event.target.value,
                      }))
                    }
                    placeholder="Default message"
                    className="h-24 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
