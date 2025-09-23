-- AlterTable
ALTER TABLE "public"."Artist" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Song" ADD COLUMN     "album" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" TEXT,
ALTER COLUMN "cover" DROP NOT NULL;
