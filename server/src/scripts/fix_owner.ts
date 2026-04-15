import { db } from "../db";
import { doosTable } from "../db/schemas/doos.schema";
import { eq } from "drizzle-orm";

async function run() {
  await db.update(doosTable).set({ owner_id: 1 }).where(eq(doosTable.id, 1));
  console.log("Updated doo owner_id to 1");
  process.exit(0);
}

run().catch(console.error);
