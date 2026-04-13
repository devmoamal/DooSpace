export const monitor = `export default function(doo: Doo) {
  doo.get("/health", async (req) => {
    return {
      status: "healthy",
      service: "Doo Space Orchestrator",
      timestamp: new Date().toISOString()
    };
  });

  doo.get("/stats", async (req) => {
    const hits = (await doo.db.get("hits") || 0) + 1;
    await doo.db.set("hits", hits);
    
    doo.log(\`System status checked. Total hits: \${hits}\`);
    return { 
      ok: true, 
      total_hits: hits,
      last_check: new Date().toISOString()
    };
  });
}`;
