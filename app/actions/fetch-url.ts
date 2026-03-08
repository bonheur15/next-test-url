"use server";

export type FetchUrlState = {
  url: string;
  status: number | null;
  contentType: string | null;
  rawText: string;
  error: string | null;
};

const INITIAL_STATE: FetchUrlState = {
  url: "",
  status: null,
  contentType: null,
  rawText: "",
  error: null,
};

export async function fetchUrlAction(
  _prevState: FetchUrlState,
  formData: FormData,
): Promise<FetchUrlState> {
  const rawUrlValue = formData.get("url");
  const inputUrl = typeof rawUrlValue === "string" ? rawUrlValue.trim() : "";

  if (!inputUrl) {
    return { ...INITIAL_STATE, error: "Please enter a URL." };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    return { ...INITIAL_STATE, url: inputUrl, error: "Invalid URL format." };
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      ...INITIAL_STATE,
      url: inputUrl,
      error: "Only http:// and https:// URLs are supported.",
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15_000);

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "*/*",
      },
    });

    clearTimeout(timeoutId);

    const text = await response.text();
    const MAX_CHARS = 200_000;
    const truncatedText =
      text.length > MAX_CHARS
        ? `${text.slice(0, MAX_CHARS)}\n\n[Output truncated at ${MAX_CHARS.toLocaleString()} characters]`
        : text;

    return {
      url: parsedUrl.toString(),
      status: response.status,
      contentType: response.headers.get("content-type"),
      rawText: truncatedText,
      error: null,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return {
        ...INITIAL_STATE,
        url: parsedUrl.toString(),
        error: "Request timed out after 15 seconds.",
      };
    }

    return {
      ...INITIAL_STATE,
      url: parsedUrl.toString(),
      error: "Could not fetch this URL. Check the URL and try again.",
    };
  }
}

export const initialFetchUrlState = INITIAL_STATE;
