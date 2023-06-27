"use client";

import { useCompletion } from "ai/react";
import React, { type FormEvent, useState } from "react";

export default function CompletionForm() {
  const {
    completion,
    input,
    isLoading,
    complete,
    handleInputChange,
    setInput,
    stop,
  } = useCompletion();
  const [type, setType] = useState("reply");

  // not using handleSubmit since additional custom attributes are needed
  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let custAttributes: Record<string, string> = {};
    switch (type) {
      case "reply":
      case "synopsis":
        custAttributes = {
          type,
          outline: input,
        };
        break;
      case "title":
      case "stars":
        custAttributes = {
          type,
          synopsis: input,
        };
        break;
    }
    complete(JSON.stringify(custAttributes));
    setInput("");
  };

  return (
    <form className="grid grid-cols-1 gap-4 p-4" onSubmit={onFormSubmit}>
      <select
        name="type"
        className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="reply">reply</option>
        <option value="synopsis">synopsis</option>
        <option value="title">title</option>
        <option value="stars">stars</option>
      </select>
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
