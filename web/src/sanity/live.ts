import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "./token";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken ?? false,
  browserToken: readToken ?? false,
});
