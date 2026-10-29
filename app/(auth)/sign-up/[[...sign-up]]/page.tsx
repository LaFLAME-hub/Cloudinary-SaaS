
import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#1f1f23] px-4 py-10">
      <Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#1f1f23]" />
        }
      >
        <SignUp
          signInUrl="/sign-in"
          appearance={{
            variables: {
              colorPrimary: "#6c47ff",
              colorBackground: "#1f1f23",
              colorForeground: "#ffffff",
              colorInputForeground: "#ffffff",
              
            },
            elements: {
              rootBox: "w-full",
              cardBox: "shadow-none",
              card: "bg-transparent shadow-none border-none",
            },
          }}
        />
      </Suspense>
    </main>
  );
}