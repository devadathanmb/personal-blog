import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { GISCUS } from "@/config";

export default function Comments() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Get initial theme
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "dark" : "light");

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute("data-theme");
      setTheme(newTheme === "dark" ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  if (!GISCUS.enabled) return null;

  return (
    <div className="mt-8">
      <Giscus
        repo={GISCUS.repo as `${string}/${string}`}
        repoId={GISCUS.repoId}
        category={GISCUS.category}
        categoryId={GISCUS.categoryId}
        mapping={GISCUS.mapping}
        reactionsEnabled={GISCUS.reactionsEnabled ? "1" : "0"}
        emitMetadata={GISCUS.emitMetadata ? "1" : "0"}
        inputPosition={GISCUS.inputPosition}
        theme={theme}
        lang={GISCUS.lang}
        loading="lazy"
      />
    </div>
  );
}
