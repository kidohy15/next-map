import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
// import { PrismaClient } from "@prisma/client";
import prisma from "@/db";
import axios from "axios";

interface Responsetype {
  page?: string;
  limit?: string;
  q?: string;
  district?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType | null>
) {
  // 데이터를 하나씩 직접 import 한 방식 -> prisma 로 변경함
  // const stores = (await import("../../data/store_data.json"))[
  //   "DATA"
  // ] as StoreType[];

  const { page = "", limit = "", q, district }: Responsetype = req.query;
  // const prisma = new PrismaClient(); // prisma 로 데이터를 가져오기 위해 객체 생성

  if (req.method === "POST") {
    // 데이터 생성(POST)을 처리한다
    const formData = req.body;
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    };

    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
      )}`,
      { headers }
    );

    // console.log("@@@data: ", data, data.documents[0].y, data.documents[0].x);

    const result = await prisma.store.create({
      data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
    });

    return res.status(200).json(result);
  } else {
    // GET 요청 처리
    if (page) {
      const count = await prisma.store.count();
      const skippage = parseInt(page) - 1;
      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        where: {
          name: q ? { contains: q } : {},
          address: district ? { contains: district } : {},
        },
        take: parseInt(limit),
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
      const { id }: { id?: string } = req.query;

      const stores = await prisma.store.findMany({
        orderBy: { id: "asc" },
        where: {
          id: id ? parseInt(id) : {},
        },
      });

      return res.status(200).json(id ? stores[0] : stores);
    }
  }
}
