import { useRef } from "react";
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
  const { data, error, size: page, setSize: setPage } = useSWRInfinite<
    Response
  >(index => `/api/images?page=${index + 1}`, fetcher);

  const currentPage = page || 0;
  const totalPages = (data && data[0] && data[0].total_pages) || 0;
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
    <div className="grid grid-cols-1 gap-4 mt-4 max-w-4xl	m-auto">
      {data &&
        data.map(page => {
          return page.results.map(image => {
            const aspectRatio = (image.height / image.width) * 100;
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
  );
};
export default ImagesPage;
