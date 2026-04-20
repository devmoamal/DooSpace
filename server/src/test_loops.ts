import { db } from "./db";
import { loopsTable } from "./db/schemas";
import { desc } from "drizzle-orm";

async function run() {
  const loops = await db.select().from(loopsTable).where(undefined).orderBy(desc(loopsTable.created_at)).limit(50).offset(0);
  console.log(loops);
  process.exit(0);
}
run();
