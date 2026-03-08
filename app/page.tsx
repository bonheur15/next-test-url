"use client";

import { useActionState } from "react";
import { fetchUrlAction, initialFetchUrlState } from "./actions/fetch-url";

export default function Home() {
  const [state, formAction, isPending] = useActionState(
    fetchUrlAction,
    initialFetchUrlState,
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">URL Raw Text Fetcher.</h1>

      <form action={formAction} className="flex flex-col gap-3">
        <label htmlFor="url" className="text-sm font-medium">
          Full URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://example.com"
          defaultValue={state.url}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Fetching..." : "Fetch URL"}
        </button>
      </form>

      {state.error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.status !== null ? (
        <div className="rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm">
          <p>Status: {state.status}</p>
          <p>Content-Type: {state.contentType ?? "unknown"}</p>
          <p>URL: {state.url}</p>
        </div>
      ) : null}

      {state.rawText ? (
        <pre className="min-h-72 overflow-auto rounded-md border border-zinc-300 bg-white p-4 text-xs leading-5 whitespace-pre-wrap break-words">
          {state.rawText}
        </pre>
      ) : null}
    </main>
  );
}
