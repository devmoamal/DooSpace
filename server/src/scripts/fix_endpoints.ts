import { db } from "../db";
import { doosTable as doos } from "../db/schemas/doos.schema";
import { extractEndpoints } from "../lib/parser";
import { eq } from "drizzle-orm";

async function run() {
  const allDoos = await db.select().from(doos);
  let updated = 0;
  for (const doo of allDoos) {
    if (doo.code) {
      const endpoints = extractEndpoints(doo.code);
      await db.update(doos).set({ endpoints }).where(eq(doos.id, doo.id));
      updated++;
    }
  }
  console.log(`Updated ${updated} doos.`);
  process.exit(0);
}

run().catch(console.error);
