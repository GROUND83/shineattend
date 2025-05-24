"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Delete, LoaderCircle } from "lucide-react";

function formatPhoneNumber(value: string) {
  if (value.length <= 3) return value;
  if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
  return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
}

export default function AttendPage() {
  const [input, setInput] = useState("010");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  //
  const handlePress = async (val: string) => {
    if (val === "backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (val === "submit") {
      if (input.length === 11) {
        // TODO: 서버로 전화번호 전송
        try {
          setLoading(true);
          console.log("input", input);
          const res = await fetch("/api/attend", {
            method: "POST",
            body: JSON.stringify({ phone: input }),
          });

          if (res.ok) {
            setMessage(
              `${formatPhoneNumber(input)}\n 학생의 등원이\n완료되었습니다.`
            );
          } else {
            const data = await res.json();
            setMessage(`${data.error}`);
          }

          setInput("010");
          // alert(`전화번호 ${input} 제출됨`);
          // setInput("");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        // 입력오류
        setMessage(`전화번호를 \n모두 입력해주세요.`);
        // alert("전화번호를 모두 입력해주세요.");
      }
    } else {
      if (input.length < 11 && /^[0-9]$/.test(val)) {
        setInput((prev) => prev + val);
      }
    }
  };
  // const handleSubmit = async () => {};

  return (
    <div className="h-screen bg-neutral-200 grid grid-cols-2 gap-3  w-full">
      <div className="flex flex-col items-center justify-center">
        <Image src={"/logo.png"} alt="학원로고" width={100} height={100} />
        <h1 className="text-xl mt-6">샤iN학원 등원 시스템</h1>
      </div>
      <div className="bg-white">
        <div className="bg-white w-full flex flex-col items-center  justify-center   gap-6 rounded-md h-[140px]">
          <p className="text-2xl font-semibold">전화번호 입력</p>

          <p className="text-4xl font-mono tracking-wider">
            {formatPhoneNumber(input)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full  h-[calc(100vh-140px)] p-3">
          <Button
            key={"1"}
            onClick={() => handlePress("1")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold  active:bg-teal-700"
            variant={"outline"}
          >
            1
          </Button>
          <Button
            key={"2"}
            onClick={() => handlePress("2")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            2
          </Button>
          <Button
            key={"3"}
            onClick={() => handlePress("3")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            3
          </Button>
          <Button
            key={"4"}
            onClick={() => handlePress("4")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            4
          </Button>
          <Button
            key={"5"}
            onClick={() => handlePress("5")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            5
          </Button>
          <Button
            key={"6"}
            onClick={() => handlePress("6")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            6
          </Button>
          <Button
            key={"7"}
            onClick={() => handlePress("7")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            7
          </Button>
          <Button
            key={"8"}
            onClick={() => handlePress("8")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            8
          </Button>
          <Button
            key={"9"}
            onClick={() => handlePress("9")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            9
          </Button>
          {/* {buttons.map((key) => (
          <Button
            key={key}
            onClick={() => handlePress(key)}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold "
            variant={"outline"}
          >
            {key}
          </Button>
        ))} */}
          <Button
            key={"backspace"}
            onClick={() => handlePress("backspace")}
            className="h-[calc(100vh-140px)/4] active:bg-teal-700"
            variant={"outline"}
          >
            <Delete className="size-10" />
          </Button>
          <Button
            key={"0"}
            onClick={() => handlePress("0")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold active:bg-teal-700"
            variant={"outline"}
          >
            0
          </Button>
          <Button
            key={"submit"}
            onClick={() => handlePress("submit")}
            className="h-[calc(100vh-140px)/4] text-2xl font-bold"
            variant={"default"}
            disabled={input.length < 11 || loading}
          >
            {loading ? <LoaderCircle className=" animate-spin size-9" /> : "✓"}
          </Button>
        </div>
      </div>
      <AlertDialog open={message ? true : false}>
        <AlertDialogContent className="flex flex-col  items-center justify-center p-32 gap-12">
          <AlertDialogTitle className=" text-2xl font-bold text-center whitespace-pre-wrap">
            {message}
          </AlertDialogTitle>

          {/* <Button onClick={() => setMessage("")}>취소</Button> */}
          <Button
            onClick={() => setMessage("")}
            className="w-full h-32 text-2xl"
          >
            확인
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// export default function AttendPage() {
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async () => {
//     const res = await fetch("/api/attend", {
//       method: "POST",
//       body: JSON.stringify({ phone }),
//     });

//     if (res.ok) {
//       setMessage("등원 체크 완료! 알림톡이 전송되었습니다.");
//     } else {
//       const data = await res.json();
//       setMessage(`실패: ${data.error}`);
//     }

//     setPhone("");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//       <div className="w-full max-w-sm space-y-4">
//         <h1 className="text-2xl font-bold text-center">등원 체크</h1>
//         <Input
//           type="tel"
//           placeholder="학생 전화번호 입력"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />
//         <Button className="w-full" onClick={handleSubmit}>
//           등원하기
//         </Button>
//         {message && (
//           <Alert variant="default">
//             <AlertDescription>{message}</AlertDescription>
//           </Alert>
//         )}
//       </div>
//     </div>
//   );
// }
