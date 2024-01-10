import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreApiResponse | StoreType[]>
) {
  // 데이터를 하나씩 직접 import 한 방식 -> prisma 로 변경함
  // const stores = (await import("../../data/store_data.json"))[
  //   "DATA"
  // ] as StoreType[];

  const { page = "" }: { page?: string } = req.query;
  const prisma = new PrismaClient(); // prisma 로 데이터를 가져오기 위해 객체 생성

  if (page) {

    const count = await prisma.store.count();
    const skippage = parseInt(page) - 1;
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
      take: 10,
      skip: skippage * 10,
    });
    
    // totalPage, data, page(현재 페이지), totalCount
    
    res.status(200).json({
      page: parseInt(page),
      data: stores,
      totalCount: count,
      totalPage: Math.ceil(count / 10),
    });
  } else {
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
    });

    return res.status(200).json(stores);
  }
  }
