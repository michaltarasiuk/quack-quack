import { DuckDBInstance } from "@duckdb/node-api";

const globalForDuckdb = globalThis as typeof globalThis & {
  __quackDuckdbInstance?: Promise<DuckDBInstance>;
};

async function createReadyInstance() {
  const instance = await DuckDBInstance.create();
  const bootstrap = await instance.connect();
  await bootstrap.run("INSTALL quack");
  await bootstrap.run("LOAD quack");
  bootstrap.disconnectSync();
  return instance;
}

function getReadyInstance() {
  globalForDuckdb.__quackDuckdbInstance ??= createReadyInstance().catch((error) => {
    globalForDuckdb.__quackDuckdbInstance = undefined;
    throw error;
  });
  return globalForDuckdb.__quackDuckdbInstance;
}

export async function getDuckConnection() {
  const instance = await getReadyInstance();
  return instance.connect();
}
