import { executeDoo } from "./runtime/executor";

async function testESM() {
  const code = `
    import { type Doo } from "doospace";
    
    export default function(doo: Doo) {
      doo.get("/test", async (req) => {
        return { ok: true, query: req.query };
      });
    }
  `;

  console.log("--- Testing ESM to CJS transpilation ---");
  const req = new Request("http://localhost:3000/test?foo=bar");
  const result = await executeDoo(1, code, "GET", "/test", req);
  const data = await result.response.json();
  console.log("Response Data:", data);
  if (data.ok && data.query.foo === "bar") {
    console.log("✅ ESM test passed!");
  } else {
    throw new Error("ESM test failed");
  }
}

async function testCanvas() {
  const code = `
    import { type Doo } from "doospace";
    
    export default function(doo: Doo) {
      doo.get("/canvas", async () => {
        doo.fill("red");
        doo.rect(2, 2, 4, 4, "blue");
        doo.pixel(0, 0, "green");
        return { ok: true };
      });
    }
  `;

  console.log("\n--- Testing Canvas APIs (fill, rect, pixel) ---");
  const req = new Request("http://localhost:3000/canvas");
  const result = await executeDoo(1, code, "GET", "/canvas", req);
  
  const pixels = result.pixels;
  console.log("Top-left pixel [0,0] (should be green):", pixels[0][0]);
  console.log("Pixel [1,1] (should be red):", pixels[1][1]);
  console.log("Pixel [2,2] (should be blue):", pixels[2][2]);
  console.log("Pixel [5,5] (should be blue):", pixels[5][5]);
  console.log("Pixel [6,6] (should be red):", pixels[6][6]);

  if (pixels[0][0] === "green" && pixels[1][1] === "red" && pixels[2][2] === "blue") {
    console.log("✅ Canvas API test passed!");
  } else {
    throw new Error("Canvas API test failed");
  }
}

async function runTests() {
  try {
    await testESM();
    await testCanvas();
    console.log("\n🚀 All tests passed successfully!");
  } catch (e) {
    console.error("\n❌ Tests failed:", e);
    process.exit(1);
  }
}

runTests();
