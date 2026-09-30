import { env } from "@/env";
import { getDuckConnection } from "@/lib/duckdb";

export default async function Home() {
  const connection = await getDuckConnection();

  const materializedResult = await connection.run(`
    FROM quack_query(
      'quack:localhost:9494',
      $$
      SELECT trace_id, name
      FROM lake.main.otlp_traces
      LIMIT 100
      $$,
      token = '${env.DUCKDB_QUACK_TOKEN}'
    );
  `);
  const rowObjectsJson = await materializedResult.getRowObjectsJson();

  return <pre>{JSON.stringify(rowObjectsJson, undefined, 2)}</pre>;
}
