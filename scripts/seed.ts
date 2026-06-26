import "dotenv/config"
import bcrypt from "bcryptjs"
import { stores } from "../lib/data"
import { prisma } from "../lib/db"

async function main() {
  console.log("Seeding database...")

  // 1. Create or update store owner
  const ownerPasswordHash = await bcrypt.hash("password123", 12)
  const storeOwner = await prisma.user.upsert({
    where: { email: "singhashirwad2003@gmail.com" },
    update: {
      name: "ASHIRWAD SINGH",
      role: "store_owner",
      passwordHash: ownerPasswordHash,
    },
    create: {
      email: "singhashirwad2003@gmail.com",
      name: "ASHIRWAD SINGH",
      role: "store_owner",
      passwordHash: ownerPasswordHash,
    },
  })
  console.log("Created/Updated Store Owner:", storeOwner.email)

  // 2. Create or update normal user
  const normalUserPasswordHash = await bcrypt.hash("password123", 12)
  const normalUser = await prisma.user.upsert({
    where: { email: "admin13@gmail.com" },
    update: {
      name: "admin12",
      role: "normal_user",
      passwordHash: normalUserPasswordHash,
    },
    create: {
      email: "admin13@gmail.com",
      name: "admin12",
      role: "normal_user",
      passwordHash: normalUserPasswordHash,
    },
  })
  console.log("Created/Updated Normal User:", normalUser.email)

  // 3. Insert stores
  for (const storeData of stores) {
    const existingStore = await prisma.store.findFirst({
      where: { name: storeData.name },
    })

    let storeId;
    if (existingStore) {
      console.log("Store already exists, updating:", storeData.name)
      const updatedStore = await prisma.store.update({
        where: { id: existingStore.id },
        data: {
          description: storeData.description,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          website: storeData.website,
          image: storeData.imageUrl,
          ownerId: storeOwner.id,
        },
      })
      storeId = updatedStore.id;
    } else {
      console.log("Creating store:", storeData.name)
      const createdStore = await prisma.store.create({
        data: {
          name: storeData.name,
          description: storeData.description,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          website: storeData.website,
          image: storeData.imageUrl,
          ownerId: storeOwner.id,
        },
      })
      storeId = createdStore.id;
    }

    // 4. Add a review for some stores (let's do it for the first 3)
    if (storeData.id <= 3) {
      const existingReview = await prisma.rating.findFirst({
        where: {
          storeId: storeId,
          userId: normalUser.id
        }
      })
      if (!existingReview) {
        await prisma.rating.create({
          data: {
            rating: 5,
            review: "Great place, really loved the experience!",
            storeId: storeId,
            userId: normalUser.id,
          }
        })
        console.log(`Added review for ${storeData.name}`)
      }
    }
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
