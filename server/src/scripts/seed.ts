import { userRepository } from "../repositories/user.repository";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const existing = await userRepository.findByUsername("moamal");
    if (existing) {
      console.log("⚠️ Admin user already exists. Skipping.");
      process.exit(0);
    }

    const hashedPassword = await Bun.password.hash("12345678");

    await userRepository.create({
      username: "moamal",
      password: hashedPassword,
    });

    console.log("✅ Admin user created: moamal / 12345678");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
