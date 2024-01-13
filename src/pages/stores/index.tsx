import React, { useCallback, useEffect, useRef } from "react";
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

export default function StoreListPage() {
  const router = useRouter();
  const { page = "1" }: any = router.query;
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;
  // console.log(pageRef);

  // console.log(page);

  // const {
  //   isLoading,
  //   isError,
  //   data: stores,
  // } = useQuery(`stores-${page}`, async () => {
  //   const { data } = await axios(`api/stores?page=${page}`);
  //   return data as StoreApiResponse;
  // });

  const fetchStores = async ({ pageParam = 1 }) => {
    // const res = await fetch("/api/projects?cusor=" + pageParam);
    const { data } = await axios("/api/stores?page=" + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
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
  } = useInfiniteQuery("stores", fetchStores, {
    getNextPageParam: (lastPage: any) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
  });

  // console.log('result',result);
  // console.log("result", data);

  // console.log(stores);

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

  // console.log("stores", stores);
  // console.log("result", result);
  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      {/* search filter */}
      <SearchFilter />
      <ul role="list" className="divide-y devide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          // stores?.data?.map((store, index) => (
          stores?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((store: StoreType, i: any) => (
                <li className="flex justify-between gap-x-6 py-5" key={i}>
                  <div className="flex gap-x-4">
                    <Image
                      src={
                        store?.category
                          ? `/images/markers/${store?.category}.png`
                          : "/images/markers/default.png"
                      }
                      width={48}
                      height={48}
                      alt="아이콘 이미지"
                    />
                    <div>
                      <div className="text-sm font-semibold leading-6 text-gray-900">
                        {store?.name}
                      </div>
                      <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                        {store?.storeType}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                      {store?.address}
                    </div>
                    <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                      {store?.phone || "번호없음"} | {store?.foodCertifyName} |{" "}
                      {store?.category}
                    </div>
                  </div>
                </li>
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
