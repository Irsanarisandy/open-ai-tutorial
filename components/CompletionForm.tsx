"use client";

import { useCompletion } from "ai/react";
import React from "react";

export default function CompletionForm() {
  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    stop,
  } = useCompletion();

  return (
    <form className="grid grid-cols-1 gap-4 p-4" onSubmit={handleSubmit}>
      <textarea
        name="message"
        className="border-2 border-solid border-gray-800"
        placeholder="Enter message..."
        value={input}
        onChange={handleInputChange}
      ></textarea>
      <button
        type="button"
        className="rounded-md border-2 border-solid border-gray-800 py-2 hover:bg-gray-200"
        onClick={stop}
      >
        Stop
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md border-2 border-solid border-gray-800 py-2 hover:bg-gray-200"
      >
        Submit
      </button>
      <output>
        <h2>Completion Result:</h2>
        <p>{completion}</p>
      </output>
    </form>
  );
}
