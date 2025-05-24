import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex flex-col  items-center justify-center h-screen gap-12">
      <Button asChild>
        <Link href={"/attend"}>등원시스템</Link>
      </Button>
      <Button asChild>
        <Link href={"/admin"}>관리자</Link>
      </Button>
    </div>
  );
}
