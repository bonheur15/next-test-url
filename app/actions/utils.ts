import { FetchUrlState } from "./types";

export const INITIAL_STATE: FetchUrlState = {
  url: "",
  status: null,
  contentType: null,
  rawText: "",
  error: null,
};

export const initialFetchUrlState = INITIAL_STATE;
