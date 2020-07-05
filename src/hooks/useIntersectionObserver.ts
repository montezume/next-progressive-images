import React from "react";

export const useIntersectionObserver = ({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = "0px"
}: {
  target: React.MutableRefObject<Element | undefined | null>;
  onIntersect: IntersectionObserverCallback;
  threshold?: number;
  rootMargin?: string;
}) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold
    });

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  });
};
