import { useState } from "react";

import Map from "@/components/Map";
import Markers from "@/components/Markers";

import StoreBox from "@/components/StoreBox";
import { StoreType } from "@/interface";
import axios from "axios";

export default function Home({ stores }: { stores: StoreType[] }) {
  // const [map, setMap] = useState(null);
  // const [currentStore, setCurrentStore] = useState(null);

  return (
    <>
      <Map />
      <Markers stores={stores} />
      <StoreBox />
    </>
  );
}

// export async function getStaticProps() {
export async function getServerSideProps() {
  // fetch 로 데이터 가져오는 방법
  // const stores = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/stores`
  // ).then((res) => res.json());

  // axios 로 데이터 가져오는 방법
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);

  return {
    props: { stores: stores.data },
    // revalidate: 60 * 60,
  };
}
