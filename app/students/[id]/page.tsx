"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StudentForm } from "@/components/StudentForm";

interface Student {
  _id: string;
  name: string;
  studentPhone: string;
  parentPhone: string;
}

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${id}`);
        if (!res.ok) throw new Error("학생을 찾을 수 없습니다.");
        const data = await res.json();
        setStudent(data);
      } catch (error) {
        console.error(error);
        alert("학생 정보를 불러오는데 실패했습니다.");
        router.push("/students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, router]);

  const handleSave = async (data: Partial<Student>) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("수정에 실패했습니다.");

      alert("수정이 완료되었습니다.");
      router.push("/students");
    } catch (error) {
      console.error(error);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (!student) {
    return <div>학생을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">학생 정보 수정</h1>
        <Button variant="outline" onClick={() => router.push("/students")}>
          목록으로
        </Button>
      </div>
      <StudentForm
        open={true}
        onClose={() => router.push("/students")}
        onSubmit={handleSave}
        initialData={student}
      />
    </div>
  );
}
