import { DuckDBInstance } from "@duckdb/node-api";

import { env } from "@/env";

const globalForDuckdb = globalThis as typeof globalThis & {
  __quackDuckdb?: Promise<DuckDBInstance>;
};

async function createInstance() {
  const instance = await DuckDBInstance.create();
  const connection = await instance.connect();
  try {
    await connection.run("INSTALL quack; LOAD quack;");
  } finally {
    connection.disconnectSync();
  }
  return instance;
}

function getInstance() {
  globalForDuckdb.__quackDuckdb ??= createInstance().catch((error) => {
    globalForDuckdb.__quackDuckdb = undefined;
    throw error;
  });
  return globalForDuckdb.__quackDuckdb;
}

export async function getDuckConnection() {
  return (await getInstance()).connect();
}

export async function quackQuery(sql: string) {
  const connection = await getDuckConnection();
  try {
    const reader = await connection.runAndReadAll(
      `FROM quack_query($endpoint, $query, token = $token)`,
      {
        endpoint: env.DUCKDB_QUACK_ENDPOINT,
        query: sql,
        token: env.DUCKDB_QUACK_TOKEN,
      },
    );
    return reader.getRowObjectsJson();
  } finally {
    connection.disconnectSync();
  }
}
