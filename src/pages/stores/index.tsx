import React, { useCallback, useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { StoreApiResponse, StoreType } from "@/interface";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useInfiniteQuery, useQuery } from "react-query";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";
import { searchState } from "@/atom";
import { useRecoilValue } from "recoil";
import StoreList from "@/components/StoreList";

export default function StoreListPage() {
  const router = useRouter();
  // const { page = "1" }: any = router.query;
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;
  const [q, setQ] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const searchValue = useRecoilValue(searchState);

  // const {
  //   isLoading,
  //   isError,
  //   data: stores,
  // } = useQuery(`stores-${page}`, async () => {
  //   const { data } = await axios(`api/stores?page=${page}`);
  //   return data as StoreApiResponse;
  // });

  const searchParams = {
    q: searchValue?.q,
    district: searchValue?.district,
  };

  const fetchStores = async ({ pageParam = 1 }) => {
    // const res = await fetch("/api/projects?cusor=" + pageParam);
    const { data } = await axios("/api/stores?page=" + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
        ...searchParams,
      },
    });

    return data;
  };

  // const result =
  const {
    data: stores,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["stores", searchParams], fetchStores, {
    getNextPageParam: (lastPage: any) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
  });

  // if (isLoading) {
  //   return <span>Loading...</span>;
  // }

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      console.log(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext();
      }, 500);
    }

    return () => clearTimeout(timerId);
  }, [fetchNext, isPageEnd, hasNextPage]);

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      {/* search filter */}
      {/* <SearchFilter setQ={setQ} setDistrict={setDistrict} /> */}
      <SearchFilter />
      <ul role="list" className="divide-y devide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          // stores?.data?.map((store, index) => (
          stores?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((store: StoreType, i: number) => (
                <StoreList store={store} i={i} key={i} />
              ))}
            </React.Fragment>
          ))
        )}
      </ul>
      {/* Pagination 영역 */}
      {/* {stores?.totalPage && (
        <Pagination total={stores?.totalPage} page={page} />
      )} */}

      {/* fetchNextPage 함수 호출 버튼 */}
      {/* <button type="button" onClick={() => fetchNextPage()}>
        Next Page
      </button> */}

      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </div>
  );
}

// react query 사용하면서 getServerSideProps는 제거함
// export async function getServerSideProps() {
//   // fetch로 데이터 호출하는 방법
//   // const stores = await fetch(
//   //   `${process.env.NEXT_PUBLIC_API_URL}/api/stores`
//   // ).then((res) => res.json());

//   // axios 로 데이터 호출하는 방법
//   const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);

//   return {
//     props: { stores: stores.data },
//   };
// }
