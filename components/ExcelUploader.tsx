"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface ExcelData {
  name: string;
  studentPhone: string;
  parentPhone: string;
}

interface ExcelUploaderProps {
  onDataUploaded: (data: ExcelData[]) => void;
}

export function ExcelUploader({ onDataUploaded }: ExcelUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
          string,
          string
        >[];

        // 데이터 형식 변환
        const formattedData: ExcelData[] = jsonData.map(
          (row: Record<string, string>) => ({
            name: row["학생명"] || "",
            studentPhone: row["학생연락처"] || "",
            parentPhone: row["학부모연락처"] || "",
          })
        );

        onDataUploaded(formattedData);
      } catch (error) {
        console.error("Excel 파일 처리 중 오류 발생:", error);
        alert("Excel 파일 처리 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      alert("파일을 읽는 중 오류가 발생했습니다.");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
        id="excel-upload"
        disabled={isLoading}
      />
      <label htmlFor="excel-upload">
        <Button
          variant="outline"
          className="w-full"
          disabled={isLoading}
          asChild
        >
          <span>{isLoading ? "처리중..." : "Excel 파일 업로드"}</span>
        </Button>
      </label>
    </div>
  );
}
