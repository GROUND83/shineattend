import { connectDB } from "@/lib/db";
import { Student } from "@/lib/models/student";
import { Attendance } from "@/lib/models/attendance";
import { NextResponse } from "next/server";
import { sendKakaoMessage } from "@/lib/kakao";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");
//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";

  await connectDB();

  let query = {};
  if (search) {
    query = {
      ["studentName"]: { $regex: search, $options: "i" },
    };
  }

  const [attends, total] = await Promise.all([
    Attendance.find(query)
      .populate({ path: "studentId", select: "name studentPhone" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments(query),
  ]);
  console.log("attends", attends);
  return NextResponse.json({
    attends,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const { phone } = await req.json();
  await connectDB();
  console.log("phone", formatPhoneNumber(phone));
  //
  function formatPhoneNumber(value: string) {
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  }
  const student = await Student.findOne({
    studentPhone: formatPhoneNumber(phone),
  });
  console.log("student", student);
  if (!student) {
    return NextResponse.json(
      { error: "학생을 찾을 수 없습니다." },
      { status: 404 }
    );
  }
  const checkInTime = dayjs().format("HH시 mm분");
  // 출석 기록
  const attendance = await Attendance.create({
    studentId: student._id,
    studentName: student.name,
    studentPhone: student.studentPhone,
  });
  console.log(dayjs().format("HH:mm"));
  // 카카오 알림톡 전송
  const parentPhone = student.parentPhone.replace(/-/g, "");
  console.log("parentPhone", parentPhone);
  const studentName = student.name;

  if (student.parentPhone && student.isSent) {
    const result = await sendKakaoMessage({
      to: parentPhone,
      content: `[샤iN학원 등원 알림]\n${studentName} 학생이 ${checkInTime}에 등원하였습니다.`,
    });

    console.log("result", result);
    Attendance.findOneAndUpdate(
      { _id: attendance._id },
      {
        isAlrimtalkSend: true,
      }
    );
  }

  // 알림톡 전송이 성공하면,
  // isAlrimtalkSend :true
  // [샤iN학원 등원 알림]
  // 김원창 학생이 16시 30분에 등원하였습니다.
  return NextResponse.json({ ok: true });
}
