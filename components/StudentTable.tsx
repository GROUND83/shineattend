"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StudentForm } from "./StudentForm";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Student {
  _id: string;
  name: string;
  studentPhone: string;
  parentPhone: string;
  isSent: boolean;
}

interface PaginatedResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}

export function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<
    "name" | "studentPhone" | "parentPhone"
  >("name");

  const fetchData = async (page: number) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      search: searchTerm,
      searchType: searchType,
    });

    const res = await fetch(`/api/students?${queryParams.toString()}`);
    const data: PaginatedResponse = await res.json();
    setStudents(data.students);
    setTotalPages(data.totalPages);
    setTotalStudents(data.total);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, searchTerm, searchType]);

  const handleSave = async (data: Partial<Student>) => {
    await fetch("/api/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setOpen(false);
    fetchData(currentPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1);
  };

  // const handleExcelUpload = async (
  //   data: { name: string; studentPhone: string; parentPhone: string }[]
  // ) => {
  //   try {
  //     console.log("data", data);
  //     const response = await fetch("/api/students/bulk", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ students: data }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("학생 데이터 업로드에 실패했습니다.");
  //     }

  //     alert("학생 데이터가 성공적으로 업로드되었습니다.");
  //     fetchData(currentPage);
  //   } catch (error) {
  //     console.error("Excel 데이터 업로드 중 오류 발생:", error);
  //     alert("학생 데이터 업로드 중 오류가 발생했습니다.");
  //   }
  // };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-xl font-bold">학생 목록</h2>
        <div className="space-x-2">
          {/* <ExcelUploader onDataUploaded={handleExcelUpload} /> */}
          <Button onClick={() => setOpen(true)}>학생 추가</Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="searchType">검색 유형</Label>
            <select
              id="searchType"
              className="w-full p-2 border rounded-md"
              value={searchType}
              onChange={(e) =>
                setSearchType(
                  e.target.value as "name" | "studentPhone" | "parentPhone"
                )
              }
            >
              <option value="name">이름</option>
              <option value="studentPhone">학생 전화번호</option>
              <option value="parentPhone">학부모 전화번호</option>
            </select>
          </div>
          <div className="flex-[2]">
            <Label htmlFor="searchTerm">검색어</Label>
            <div className="flex gap-2">
              <Input
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <Button type="submit">검색</Button>
            </div>
          </div>
        </div>
      </form>

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">이름</th>
            <th className="p-2 border">학생 전화번호</th>
            <th className="p-2 border">학부모 전화번호</th>
            <th className="p-2 border">등원 알림</th>
            <th className="p-2 border">작업</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.studentPhone}</td>
              <td className="p-2 border">{s.parentPhone}</td>
              <td className="p-2 border space-x-2">
                <Switch checked={s.isSent} />
              </td>
              <td className="p-2 border space-x-2">
                <Link href={`/admin/students/${s._id}`}>
                  <Button variant="outline">수정</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">총 {totalStudents}명의 학생</div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 현재 페이지 주변의 페이지 번호만 표시
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      </div>

      <StudentForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}
