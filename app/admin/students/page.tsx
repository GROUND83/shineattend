// app/admin/students/page.tsx
import { StudentTable } from "@/components/StudentTable";

export default function StudentPage() {
  return (
    <div className="p-6 w-full">
      <StudentTable />
    </div>
  );
}
