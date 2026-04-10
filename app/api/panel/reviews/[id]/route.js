import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../../lib/admin-api";

export async function PATCH(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.rating !== undefined) data.rating = parseInt(body.rating);
    if (body.comment !== undefined) data.comment = body.comment;
    if (body.service !== undefined) data.service = body.service;
    if (body.isApproved !== undefined) data.isApproved = body.isApproved;
    
    const review = await prisma.review.update({ where: { id }, data });
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
