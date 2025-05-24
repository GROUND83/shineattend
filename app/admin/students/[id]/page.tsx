"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";
import { Switch } from "@/components/ui/switch";
interface Student {
  _id: string;
  name: string;
  studentPhone: string;
  parentPhone: string;
  createdAt: string;
  updatedAt: string;
  isSent: boolean;
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${id}`);
        if (!res.ok) throw new Error("학생을 찾을 수 없습니다.");
        const data = await res.json();
        setStudent(data);
        setFormData(data);
      } catch (error) {
        console.error(error);
        alert("학생 정보를 불러오는데 실패했습니다.");
        router.push("/admin/students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("수정에 실패했습니다.");

      const updatedStudent = await res.json();
      setStudent(updatedStudent);
      setIsEditing(false);
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제에 실패했습니다.");

      alert("삭제가 완료되었습니다.");
      router.push("/admin/students");
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="p-6">로딩중...</div>;
  }

  if (!student) {
    return <div className="p-6">학생을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6  w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">학생 상세 정보</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/students")}
          >
            목록으로
          </Button>
          {isEditing ? (
            <>
              <Button onClick={handleSave}>저장</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button variant="destructive" onClick={handleDelete}>
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="attendance">출석 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentPhone">학생 전화번호</Label>
                  <Input
                    id="studentPhone"
                    name="studentPhone"
                    value={formData.studentPhone || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">학부모 전화번호</Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    value={formData.parentPhone || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 flex-col items-start">
                  <Label htmlFor="parentPhone">등원알림 발송</Label>
                  <div className="mt-2">
                    <Switch
                      id="isSent"
                      name="isSent"
                      checked={formData.isSent}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isSent: checked }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>생성일: {new Date(student.createdAt).toLocaleString()}</p>
                <p>수정일: {new Date(student.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>출석 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">출석 기록 기능 준비중입니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
