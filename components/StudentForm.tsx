"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1),
  studentPhone: z.string().min(10),
  parentPhone: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export function StudentForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "학생 수정" : "학생 추가"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}
          className="space-y-3"
        >
          <Input placeholder="이름" {...register("name")} />
          <Input placeholder="학생 전화번호" {...register("studentPhone")} />
          <Input placeholder="학부모 전화번호" {...register("parentPhone")} />
          <Button type="submit" className="w-full">
            저장
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
