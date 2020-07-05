import { useState, useRef } from "react";
import { useSWRInfinite } from "swr";
// import { Image } from "@montezume/react-progressive-image";
import { Image } from "../src/components/image";
import { useIntersectionObserver } from "../src/hooks/useIntersectionObserver";
import { Image as ImageType } from "../types";
import styles from "./index.module.css";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

interface Response {
  total: number;
  total_pages: number;
  results: ImageType[];
}

const ImagesPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("portugal");
  const { data, error, size: page, setSize: setPage } = useSWRInfinite<
    Response
  >(
    index => `/api/images?page=${index + 1}&per_page=20&query=${query}`,
    fetcher
  );

  const currentPage = page || 0;
  const totalPages = (data && data[0] && data[0].total_pages) || 0;
  const totalResults = (data && data[0] && data[0].total) || 0;
  const hasMorePages = currentPage + 1 < totalPages;

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (page && (data && typeof data[page - 1] === "undefined"));

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting && !isLoadingMore && hasMorePages) {
        if (setPage) {
          setPage(page => page + 1);
        }
      }
    }
  });

  return (
    <div className="mt-4 max-w-4xl	m-auto">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="searchQuery"
        >
          Search
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="searchQuery"
          type="text"
          onBlur={event => {
            console.log(event.target.value);
            setQuery(event.target.value);
          }}
          placeholder="Search ..."
        />
      </div>
      <p>Total results {totalResults}</p>

      <div className="grid grid-cols-3 gap-2 ">
        {data &&
          data.map(page => {
            return page.results.map(image => {
              const aspectRatio = (image.height / image.width) * 100;
              // let orientation = aspectRatio > 100 ? "landscape" : "portrait";

              return (
                <div
                  className="overflow-hidden relative"
                  key={image.id}
                  style={{ paddingBottom: `${aspectRatio}%` }}
                >
                  <Image
                    src={image.urls.regular}
                    thumb={image.urls.raw}
                    alt={image.alt_description}
                    className={styles.image}
                  />
                </div>
              );
            });
          })}
        <div style={{ height: "20px" }} ref={ref} />
      </div>
    </div>
  );
};
export default ImagesPage;
