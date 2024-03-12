import { useState } from "react";

import Map from "@/components/Map";
import Markers from "@/components/Markers";

import StoreBox from "@/components/StoreBox";
import { StoreType } from "@/interface";
import CurrentLocationButton from "@/components/CurrentLocationButton";

export default async function Home() {
  // const [map, setMap] = useState(null);
  // const [currentStore, setCurrentStore] = useState(null);

  const stores: StoreType[] = await getData();
  return (
    <>
      <Map />
      <Markers stores={stores} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  );
}

// export async function getStaticProps() {
async function getData() {
  // fetch 로 데이터 가져오는 방법
  // const stores = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/stores`
  // ).then((res) => res.json());

  // axios 로 데이터 가져오는 방법
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
