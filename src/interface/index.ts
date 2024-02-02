// 기존 타입 코드
// export interface StoreType {
//   tel_no: string; // 가게 전화번호
//   cob_code_nm: string; // 판매 업종 코드
//   bizcnd_code_nm: string; // 커스텀 이미지를 위한 카테고리 코드 네임
//   upso_nm: string; // 가게명, 업소명
//   x_cnts: string; // x축
//   y_dnts: string; // y축
//   rdn_code_nm: string; // 도로명 주소
//   crtfc_gbn_nm: string; // 식품인증 구분명
// }

import { User } from "@prisma/client";

// 수정한 타입 코드
export interface StoreType {
  id: number;
  phone: string | null; // 가게 전화번호
  address: string | null; // 도로명 주소
  lat: string | null; // x축
  lng: string | null; // y축
  name: string | null; // 가게명, 업소명
  category: string | null; // 커스텀 이미지를 위한 카테고리 코드 네임
  storeType: string | null; // 판매 업종 코드
  foodCertifyName: string | null; // 식품인증 구분명
  likes?: LikeInterface[];
}

export interface LikeInterface {
  id: number;
  storeId: number;
  userId: number;
  store?: StoreType;
}

export interface LikeApiResponse {
  data: LikeInterface[];
  totalPage?: number;
  page?: number;
}

export interface CommentInterface {
  id: number;
  storeId: number;
  userId: number;
  store?: StoreType;
  body: string;
  user?: UserType;
  createdAt: Date;
}

interface UserType {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface CommentApiResponse {
  data: CommentInterface[];
  totalPage?: number;
  page?: number;
}

export interface StoreApiResponse {
  data: StoreType[];
  totalPage?: number;
  totalCount?: number;
  page?: number;
}

export interface LocationType {
  lat?: string | null;
  lng?: string | null;
  zoom: number;
}

export interface SearchType {
  q?: string;
  district?: string;
}
