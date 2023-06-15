"use client";

import { useChat } from "ai/react";
import React from "react";

export default function CompletionForm() {
  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat();

  return (
    <form className="h-screen flex flex-col p-4" onSubmit={handleSubmit}>
      <div className="flex flex-col flex-auto overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex rounded-md text-white px-4 py-2 ${
              m.role === "user"
                ? "bg-blue-700 self-end"
                : "bg-slate-600 self-start"
            }`}
          >
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <textarea
          name="userInput"
          className="border-2 border-solid border-gray-800 flex-auto"
          placeholder="Enter message here..."
          value={input}
          onChange={handleInputChange}
        ></textarea>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border-2 border-solid border-gray-800 ml-4 px-4 py-2 hover:bg-gray-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
