// src/components/routine/ExerciseImageCarousel.tsx

"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  fallbackExerciseImagePath,
  resolveExerciseImage
} from "@/lib/images/resolveExerciseImage";
import type { ExercisePosition } from "@/types/exercise";

type ExerciseImageCarouselProps = {
  positions: ExercisePosition[];
};

const fallbackPosition: ExercisePosition = {
  id: "fallback-position",
  title: "Imagen no disponible",
  imagePath: fallbackExerciseImagePath
};

const styles = {
  wrapper: {
    display: "grid",
    gap: "0.75rem"
  },
  imageFrame: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    aspectRatio: "1 / 1",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "rgba(255, 255, 255, 0.45)"
  },
  image: {
    objectFit: "cover"
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    gap: "0.4rem"
  },
  dot: {
    height: "0.5rem",
    width: "0.5rem",
    borderRadius: "999px",
    background: "rgba(31, 31, 31, 0.22)"
  },
  dotActive: {
    background: "var(--primary)"
  }
} satisfies Record<string, CSSProperties>;

export function ExerciseImageCarousel({
  positions
}: ExerciseImageCarouselProps) {
  const imageItems = useMemo(
    () => (positions.length > 0 ? positions : [fallbackPosition]),
    [positions]
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const activePosition = imageItems[currentImageIndex] ?? fallbackPosition;
  const [imageSrc, setImageSrc] = useState(
    resolveExerciseImage(activePosition.imagePath)
  );

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [imageItems]);

  useEffect(() => {
    setImageSrc(resolveExerciseImage(activePosition.imagePath));
  }, [activePosition.imagePath]);

  useEffect(() => {
    if (imageItems.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentImageIndex((currentIndex) =>
        currentIndex + 1 >= imageItems.length ? 0 : currentIndex + 1
      );
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [imageItems.length]);

  function handleImageError(): void {
    if (imageSrc !== fallbackExerciseImagePath) {
      setImageSrc(fallbackExerciseImagePath);
    }
  }

  return (
    <section style={styles.wrapper} aria-label="Carrusel de imágenes">
      <div style={styles.imageFrame}>
        <Image
          src={imageSrc}
          alt={activePosition.title}
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          style={styles.image}
          onError={handleImageError}
          priority={false}
        />
      </div>

      {imageItems.length > 1 ? (
        <div style={styles.dots} aria-label="Indicadores del carrusel">
          {imageItems.map((position, index) => (
            <span
              key={position.id}
              style={{
                ...styles.dot,
                ...(index === currentImageIndex ? styles.dotActive : {})
              }}
              aria-label={`Imagen ${index + 1} de ${imageItems.length}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}