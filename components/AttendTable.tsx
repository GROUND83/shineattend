"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

interface Attend {
  _id: string;
  studentName: string;
  sutdentPhone: string;
  studentId: string;
  isAlrimtalkSend: string;
  createdAt: Date;
  updatedat: Date;
}

interface PaginatedResponse {
  attends: Attend[];
  total: number;
  page: number;
  totalPages: number;
}

export function AttendTable() {
  const [students, setStudents] = useState<Attend[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page: number) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      search: searchTerm,
    });

    const res = await fetch(`/api/attend?${queryParams.toString()}`);
    const data: PaginatedResponse = await res.json();
    console.log("data", data);
    setStudents(data.attends);
    setTotalPages(data.totalPages);
    setTotalStudents(data.total);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1);
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-xl font-bold">학생 목록</h2>
        <div className="space-x-2">
          {/* <ExcelUploader onDataUploaded={handleExcelUpload} /> */}
          {/* <Button onClick={() => setOpen(true)}>학생 추가</Button> */}
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-4 items-end">
          <div className="flex-[2]">
            <Label htmlFor="searchTerm">검색어</Label>
            <div className="flex gap-2">
              <Input
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름을 입력하세요"
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
            <th className="p-2 border">등원시간</th>
            <th className="p-2 border">카카오 알림</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="p-2 border">{s.studentName}</td>
              <td className="p-2 border">{s.sutdentPhone}</td>
              <td className="p-2 border">
                {dayjs(s.createdAt).format("YYYY-MM-DD HH시mm분")}
              </td>
              <td className="p-2 border space-x-2">
                <Switch checked={s.isAlrimtalkSend ? true : false} />
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
    </div>
  );
}
