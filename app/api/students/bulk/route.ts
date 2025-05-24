import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/lib/models/student";

interface StudentInput {
  name: string;
  studentPhone: string;
  parentPhone: string;
}

export async function POST(request: Request) {
  try {
    const { students } = await request.json();
    await connectDB();
    console.log("students", students);
    // 데이터 유효성 검사
    const validStudents = students.filter((student: StudentInput) => {
      return student.name && student.studentPhone && student.parentPhone;
    });

    if (validStudents.length === 0) {
      return NextResponse.json(
        { error: "유효한 학생 데이터가 없습니다." },
        { status: 400 }
      );
    }

    // 대량 삽입
    const result = await Student.insertMany(validStudents);

    return NextResponse.json({
      message: `${result.length}명의 학생이 추가되었습니다.`,
      students: result,
    });
  } catch (error) {
    console.error("대량 학생 데이터 처리 중 오류:", error);
    return NextResponse.json(
      { error: "학생 데이터 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
