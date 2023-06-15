import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Link
        className="text-blue-600 hover:underline"
        href="/completion-example"
      >
        Completion Example
      </Link>
      <Link className="text-blue-600 hover:underline" href="/chat-example">
        Chat Example
      </Link>
    </main>
  );
}
