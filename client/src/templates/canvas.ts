export const canvas = `export default function(doo: Doo) {
  doo.get("/", async (req) => {
    // Drawn a 2x2 brand-colored square at origin
    doo.pixel(0, 0, "brand");
    doo.pixel(1, 0, "brand");
    doo.pixel(0, 1, "brand");
    doo.pixel(1, 1, "brand");
    
    doo.log("Canvas updated with brand signature");
    return { ok: true, pixels_drawn: 4 };
  });

  doo.get("/clear", async (req) => {
    doo.log("Clear request received");
    return { ok: true };
  });
}`;
