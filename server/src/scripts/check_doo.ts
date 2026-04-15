import { db } from "../db";
import { doosTable } from "../db/schemas/doos.schema";
import { secretsTable } from "../db/schemas/secrets.schema";

async function check() {
  const allDoos = await db.select().from(doosTable);
  console.log("Doos:", allDoos.map(d => ({ id: d.id, owner_id: d.owner_id })));
  
  const allSecrets = await db.select().from(secretsTable);
  console.log("Secrets:", allSecrets.map(s => ({ id: s.id, user_id: s.user_id, name: s.name })));
  
  process.exit(0);
}
check();
