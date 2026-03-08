export type FetchUrlState = {
  url: string;
  status: number | null;
  contentType: string | null;
  rawText: string;
  error: string | null;
};
