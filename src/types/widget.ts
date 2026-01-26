export type WidgetPlatform = "whatsapp" | "telegram" | "messenger" | "email";

export type BubblePosition = "bottom-right" | "bottom-left" | "custom";
export type BubbleShape = "circle" | "rounded";

export interface BubbleConfig {
  size: {
    width: number;
    height: number;
  };
  shape: BubbleShape;
  iconSize: number;
  iconColor: string;
  backgroundColor: string;
  position: BubblePosition;
  offsetX: number;
  offsetY: number;
  shadow: boolean;
}

export interface WidgetUiConfig {
  width: number;
  height: number;
  headerBgColor: string;
  headingText: string;
  statusText: string;
  profileImage: string;
  greetingText: string;
  inputPlaceholder: string;
  buttonColor: string;
  fontSize: number;
}

export interface WidgetContact {
  phone?: string;
  username?: string;
  pageId?: string;
  email?: string;
  subject?: string;
}

export interface WidgetConfig {
  widgetId?: string;
  name: string;
  platform: WidgetPlatform;
  contact: WidgetContact;
  defaultMessage: string;
  bubble: BubbleConfig;
  widget: WidgetUiConfig;
  createdAt?: string;
  updatedAt?: string;
}

