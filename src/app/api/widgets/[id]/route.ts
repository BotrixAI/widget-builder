import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { WidgetModel } from "@/lib/models/Widget";
import { widgetInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!id || id.length > 32) {
    return NextResponse.json({ error: "Invalid widget id" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const widget = await WidgetModel.findOne({ widgetId: id }).lean();

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Failed to load widget", error);
    return NextResponse.json(
      { error: "Failed to load widget" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!id || id.length > 32) {
    return NextResponse.json({ error: "Invalid widget id" }, { status: 400 });
  }

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

  const parsed = widgetInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid widget payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const widget = await WidgetModel.findOneAndUpdate(
      { widgetId: id },
      parsed.data,
      { new: true }
    ).lean();

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json({ widgetId: widget.widgetId });
  } catch (error) {
    console.error("Failed to update widget", error);
    return NextResponse.json(
      { error: "Failed to update widget" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!id || id.length > 32) {
    return NextResponse.json({ error: "Invalid widget id" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const deleted = await WidgetModel.findOneAndDelete({
      widgetId: id,
    }).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete widget", error);
    return NextResponse.json(
      { error: "Failed to delete widget" },
      { status: 500 }
    );
  }
}

