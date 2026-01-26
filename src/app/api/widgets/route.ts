import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { WidgetModel } from "@/lib/models/Widget";
import { widgetInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

function generateWidgetId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export async function GET() {
  try {
    await connectToDatabase();
    const widgets = await WidgetModel.find({})
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      items: widgets.map((widget) => ({
        widgetId: widget.widgetId,
        name: widget.name,
        platform: widget.platform,
        updatedAt: widget.updatedAt,
        createdAt: widget.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to list widgets", error);
    return NextResponse.json(
      { error: "Failed to load widgets" },
      { status: 500 }
    );
  }
}

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

  const parsed = widgetInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid widget payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const created = await createWidgetWithRetry(parsed.data);

    return NextResponse.json({
      widgetId: created.widgetId,
    });
  } catch (error) {
    console.error("Failed to create widget", error);
    return NextResponse.json(
      { error: "Failed to create widget" },
      { status: 500 }
    );
  }
}

async function createWidgetWithRetry(
  data: typeof widgetInputSchema._output
) {
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const widgetId = generateWidgetId();
    try {
      return await WidgetModel.create({ ...data, widgetId });
    } catch (error: unknown) {
      const isDuplicate =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000;
      if (!isDuplicate || attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }
  throw new Error("Failed to allocate widget id");
}

