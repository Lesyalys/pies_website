import { useEffect, useRef } from "react";

// Укажите ваш URL из конструктора (тот, что вы прислали)
const YANDEX_MAP_SRC =
  "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ae4ed7705540cc77d9b9a85b5bbf42bc69333e9462f083f1f71897fb039c9cb77&width=100%&height=100%&lang=ru_RU&scroll=true";

export const Map = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    // Создаём контейнер для карты внутри нашего div
    const mapContainer = document.createElement("div");
    mapContainer.id = "yandex-map-container";
    mapContainer.style.width = "100%";
    mapContainer.style.height = "100%";
    containerRef.current.appendChild(mapContainer);

    // Создаём и загружаем скрипт
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = YANDEX_MAP_SRC.replace(
      "width=100%&height=100%",
      `width=${containerRef.current.clientWidth}&height=${containerRef.current.clientHeight}`,
    );
    mapContainer.appendChild(script);

    return () => {
      // Чистим при размонтировании
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="yandex-map"
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
};
