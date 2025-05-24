import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-start">
      <div className=" border-r w-[180px] h-screen p-3">
        <p className="font-bold">샤iN학원 등원시스템</p>
        <p className="text-sm">어드민</p>
        <div className="mt-3  space-y-3">
          <Button asChild className="w-full">
            <Link href={"/admin/students"}>
              <p>학생관리</p>
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href={"/admin/attends"}>
              <p>등원관리</p>
            </Link>
          </Button>
          {/* <p>등원관리</p> */}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
