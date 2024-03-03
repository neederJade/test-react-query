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
        // if (lastId === "마카") reject(new Error("this is Errrororror"));

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
    initialPageParam: "제이드1",
    getNextPageParam: (lastPage) => lastPage.id,
    getPreviousPageParam: () => null,
  });

  useEffect(() => {
    fetchNextPage();
  }, [page]);

  console.log(data);

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
        <p
          style={{
            border: "1px solid yellow",
            fontWeight: 500,
            padding: "20px",
            marginBottom: "10px",
            color: "yellow",
          }}
        >
          Loading
        </p>
      ) : (
        <div
          style={{
            border: "1px solid pink",
            padding: "20px",
            fontWeight: 500,
            marginBottom: "10px",
            color: "pink",
          }}
        >
          {data?.pages?.[page - 1]?.id}
        </div>
      )}
      {error ? (
        <p
          style={{
            border: "1px solid red",
            fontWeight: 500,
            padding: "20px",
            marginBottom: "10px",
            color: "red",
          }}
        >
          Error
        </p>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
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
