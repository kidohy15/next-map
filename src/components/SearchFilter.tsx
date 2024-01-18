import { AiOutlineSearch } from "react-icons/ai";
import { DISTRICT_ARR } from "@/data/store";
import { searchState } from "@/atom";
import { useRecoilState } from "recoil";
// import { Dispatch, SetStateAction } from "react";

// recoil 사용하면서 필요없어져서 주석함
// interface SearchFilterPros {
//   setQ: Dispatch<SetStateAction<string | null>>;
//   setDistrict: Dispatch<SetStateAction<string | null>>;
// }

// export default function SearchFilter({ setQ, setDistrict }: SearchFilterPros) {
export default function SearchFilter() {
  const [search, setSearch] = useRecoilState(searchState);
  return (
    <div className="flex flex-col md:flex-row gap-2 my-4">
      <div className="flex items-center justify-center w-full gap-2">
        <AiOutlineSearch className="w-6 h-6" />
        <input
          type="search"
          onChange={(e) => setSearch({ ...search, q: e.target.value })}
          placeholder="음식점 검색"
          className="block w-full p-3 text-sm text-gray-800 border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-blue-500"
        />
      </div>
      <select
        onChange={(e) => setSearch({ ...search, district: e.target.value })}
        className="bg-gray-50 border border-gray-300 text-gray-800 text-sm md:max-w-[200px] rounded-lg focus:border-blue-500 outline-none block w-full p-3"
      >
        <option value="">지역 검색</option>
        {DISTRICT_ARR.map((data) => (
          <option value={data} key={data}>
            {data}
          </option>
        ))}
      </select>
    </div>
  );
}
