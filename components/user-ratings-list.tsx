import { prisma } from "@/lib/db"
import { UserRatingsClient } from "./user-ratings-client"

interface UserRatingsListProps {
  userId: number
}

export async function UserRatingsList({ userId }: UserRatingsListProps) {
  const ratings = await prisma.rating.findMany({
    where: { userId },
    include: {
      store: {
        select: {
          name: true,
          address: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return <UserRatingsClient ratings={ratings} />
}
