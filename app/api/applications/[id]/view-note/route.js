import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request, context) {
  const resolvedParams = await context.params;
  const id = resolvedParams.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const updated = await prisma.application.update({
      where: { id },
      data: { adminNoteViewed: true },
    });

    return NextResponse.json({ success: true, appIndex: updated.appIndex });
  } catch (error) {
    console.error("Failed to mark admin note as viewed:", error);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}
