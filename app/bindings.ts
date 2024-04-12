import type { D1Database, KVNamespace } from "@cloudflare/workers-types";
import { binding } from "cf-bindings-proxy";

export const kv = binding<KVNamespace>("kv");
export const db = binding<D1Database>("DB");
