import React from "react";
import cx from "classnames";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import styles from "./image.module.css";

export const Image: React.FC<any> = props => {
  const ref = React.useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observer) => {
      if (isIntersecting && ref.current) {
        setIsVisible(true);
        observer.unobserve(ref.current);
      }
    }
  });

  return (
    <React.Fragment>
      <img
        ref={ref}
        src={`${props.thumb}&w=20`}
        className={cx(styles.image, styles.thumb, {
          [styles.loaded]: isLoaded
        })}
      />
      {isVisible && (
        <img
          className={cx(styles.image, styles.full, {
            [styles.loaded]: isLoaded
          })}
          src={props.src}
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      )}
    </React.Fragment>
  );
};
