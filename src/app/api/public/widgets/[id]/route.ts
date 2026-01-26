import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { WidgetModel } from "@/lib/models/Widget";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  const { id } = params;
  if (!id || id.length > 32) {
    return NextResponse.json(
      { error: "Invalid widget id" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    await connectToDatabase();
    const widget = await WidgetModel.findOne({ widgetId: id }).lean();

    if (!widget) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        widgetId: widget.widgetId,
        platform: widget.platform,
        contact: widget.contact,
        defaultMessage: widget.defaultMessage,
        bubble: widget.bubble,
        widget: widget.widget,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to load public widget", error);
    return NextResponse.json(
      { error: "Failed to load widget" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

