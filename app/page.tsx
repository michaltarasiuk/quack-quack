import { quackQuery } from "@/lib/duckdb";

export default async function Home() {
  const rows = await quackQuery(`
    SELECT
      service_name,
      name,
      status_code,
      kind,
      start_time_unix_nano,
      duration_time_unix_nano,
      trace_id,
      span_id,
      parent_span_id
    FROM lake.main.otlp_traces
    ORDER BY start_time_unix_nano DESC
    LIMIT 100
  `);

  return <pre>{JSON.stringify(rows, undefined, 2)}</pre>;
}
