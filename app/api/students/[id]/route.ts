// GET: 상세, PUT: 수정, DELETE: 삭제
import { connectDB } from "@/lib/db";
import { Student } from "@/lib/models/student";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const student = await Student.findById(id);

  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const update = await request.json();

  const student = await Student.findByIdAndUpdate(id, update, { new: true });

  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  await Student.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
