export const starter = `export default function(doo: Doo) {
  doo.get("/", async (req) => {
    doo.log("Starter kit initialized");
    return { 
      ok: true, 
      message: "Welcome to DooSpace!",
      timestamp: new Date().toISOString()
    };
  });
}`;
