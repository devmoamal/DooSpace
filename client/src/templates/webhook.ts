export const webhook = `export default function(doo: Doo) {
  doo.post("/webhook", async (req) => {
    const payload = req.body;
    doo.log(\`Received webhook event: \${JSON.stringify(payload)}\`);
    
    // Store events with high-density timestamps
    const events = (await doo.db.get("events")) || [];
    events.push({ 
      ...payload, 
      received_at: new Date().toISOString() 
    });
    
    // Keep only last 50 events
    if (events.length > 50) events.shift();
    
    await doo.db.set("events", events);
    return { ok: true, status: "event_logged" };
  });

  doo.get("/events", async (req) => {
    const events = (await doo.db.get("events")) || [];
    return { ok: true, data: events };
  });
}`;
