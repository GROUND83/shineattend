// GET: 목록, POST: 생성
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/lib/models/student";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const searchType = searchParams.get("searchType") || "name";

  await connectDB();

  let query = {};
  if (search) {
    query = {
      [searchType]: { $regex: search, $options: "i" },
    };
  }

  const [students, total] = await Promise.all([
    Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(query),
  ]);

  return NextResponse.json({
    students,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  await connectDB();
  const newStudent = await Student.create(data);
  return NextResponse.json(newStudent);
}
