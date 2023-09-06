import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db
}


// nextjs hot reload yaptığı için her reloadda prisma tekrar çağırılmasın diye böyle bir yöntem yaptık
// bu yöntemle prisma client global değişken olarak tutuluyor ve client oluşturulduysa tekrar oluşturulmuyor.
// globalThis hot reloaddan etkilenmiyor.