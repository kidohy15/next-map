import type { NextApiRequest, NextApiResponse } from "next";
import { StoreType } from "@/interface";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreType[]>
) {
  // 데이터를 하나씩 직접 import 한 방식 -> prisma 로 변경함
  // const stores = (await import("../../data/store_data.json"))[
  //   "DATA"
  // ] as StoreType[];

  // prisma 로 데이터를 가져온다
  const prisma = new PrismaClient();
  const stores = await prisma.store.findMany({
    orderBy: { id: "asc" },
  });

  res.status(200).json(stores);
}
