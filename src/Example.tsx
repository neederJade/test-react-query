import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Data {
  id: string;
  age: number;
  favorite: string[];
}

const dummyData = [
  {
    id: "제이드1",
    age: 2,
    favorite: ["unnie", "walk", "bapp"],
  },
  {
    id: "제이드2",
    age: 8,
    favorite: ["other dogs"],
  },
  {
    id: "제이드3",
    age: 1,
    favorite: ["영감님"],
  },
  {
    id: "제이드4",
    age: 15,
    favorite: ["밤양갱"],
  },
];

const fetchDataFnc = (lastId?: string, error?: boolean): Promise<Data> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        {
          reject("error is commmmmmmming!");
        }
      }
      if (lastId) {
        const index = dummyData.findIndex((item) => {
          return item.id === lastId;
        });

        const arr = [...dummyData];
        const result: Data[] = arr.splice(index + 1, 1);

        if (index < dummyData.length) resolve(result[0]);
        else return;
      } else {
        resolve(dummyData[0]);
      }
    }, 1000);
  });
};

export const Example = () => {
  const [page, setPage] = useState(1);

  const {
    isPending,
    isFetchingNextPage,
    error,
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["testData"],
    queryFn: async ({ pageParam = "" }) => await fetchDataFnc(pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.id,
    getPreviousPageParam: () => null,
  });

  useEffect(() => {
    fetchNextPage();
  }, [page]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <h1>Component Title</h1>
      <p>length:{data?.pages.length}</p>
      {isPending || isFetchingNextPage ? (
        <p>Loading</p>
      ) : (
        <p>{data?.pages?.[page - 1]?.id}</p>
      )}
      {error ? <p>Error</p> : null}
      <div>
        <button
          onClick={() => {
            setPage(page - 1);
          }}
        >
          prev:{page - 1}
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => {
            if (!isFetchingNextPage) {
              setPage(page + 1);
            }
          }}
        >
          next:{page + 1}
        </button>
      </div>
    </div>
  );
};
