import { useRef } from "react";
import { useSWRInfinite } from "swr";
import { Image } from "@montezume/react-progressive-image";
import { useIntersectionObserver } from "../src/hooks/useIntersectionObserver";
import styles from "./index.module.css";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

const ImagesPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data, error, size, setSize } = useSWRInfinite(
    index => `/api/images?page=${index + 1}`,
    fetcher
  );

  console.log(size);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size && (data && typeof data[size - 1] === "undefined"));

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting && !isLoadingMore) {
        if (setSize) {
          setSize(size => size + 1);
        }
      }
    }
  });

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 max-w-5xl	m-auto">
      {data &&
        data.map(page => {
          return page.results.map((res: any) => {
            const aspectRatio = (res.height / res.width) * 100;
            return (
              <div className="overflow-hidden" key={res.id}>
                <Image
                  key={res.id}
                  src={res.urls.regular}
                  thumb={res.urls.thumb}
                  alt={res.alt_description}
                  className={styles.image}
                  aspectRatio={aspectRatio}
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
