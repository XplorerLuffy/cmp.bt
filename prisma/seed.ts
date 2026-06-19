import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@cmp.bt").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });
  console.log(`Admin account ready: ${email}`);

  const sampleProducts = [
    {
      name: "Spicy Chili Achaar",
      slug: "spicy-chili-achaar",
      description: "Our signature fiery chili achaar, made with fresh Bhutanese chilies and mustard oil.",
      ingredients: "Chili, mustard oil, garlic, ginger, salt, turmeric",
      price: 250,
      category: "Chili Achaar",
      stock: 50,
    },
    {
      name: "Mango Pickle",
      slug: "mango-pickle",
      description: "Tangy and sweet mango pickle made from sun-ripened mangoes.",
      ingredients: "Raw mango, mustard seeds, fenugreek, chili powder, oil",
      price: 280,
      category: "Fruit Pickle",
      stock: 30,
    },
    {
      name: "Radish Ezay",
      slug: "radish-ezay",
      description: "Classic Bhutanese ezay made with fresh radish and dried chili.",
      ingredients: "Radish, dried red chili, cheese, salt",
      price: 220,
      category: "Ezay",
      stock: 40,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`Seeded ${sampleProducts.length} sample products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
