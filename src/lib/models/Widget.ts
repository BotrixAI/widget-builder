import mongoose, { Schema } from "mongoose";

const BubbleSchema = new Schema(
  {
    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    shape: { type: String, required: true },
    iconSize: { type: Number, required: true },
    iconColor: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    position: { type: String, required: true },
    offsetX: { type: Number, required: true },
    offsetY: { type: Number, required: true },
    shadow: { type: Boolean, required: true },
  },
  { _id: false }
);

const WidgetUiSchema = new Schema(
  {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    headerBgColor: { type: String, required: true },
    headingText: { type: String, required: true },
    statusText: { type: String, required: true },
    profileImage: { type: String, required: false, default: "" },
    greetingText: { type: String, required: true },
    inputPlaceholder: { type: String, required: true },
    buttonColor: { type: String, required: true },
    fontSize: { type: Number, required: true },
  },
  { _id: false }
);

const ContactSchema = new Schema(
  {
    phone: { type: String, default: "" },
    username: { type: String, default: "" },
    pageId: { type: String, default: "" },
    email: { type: String, default: "" },
    subject: { type: String, default: "" },
  },
  { _id: false }
);

const WidgetSchema = new Schema(
  {
    widgetId: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    platform: { type: String, required: true },
    contact: { type: ContactSchema, required: true },
    defaultMessage: { type: String, required: true },
    bubble: { type: BubbleSchema, required: true },
    widget: { type: WidgetUiSchema, required: true },
  },
  { timestamps: true }
);

export const WidgetModel =
  mongoose.models.Widget || mongoose.model("Widget", WidgetSchema);

