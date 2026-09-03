"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import DestinationCard from "./DestinationCard";
import { DESTINATION_CATEGORIES, DESTINATIONS } from "@/data/destinations";

export default function TourismExplorer({ destinations = DESTINATIONS }) {
  const [category, setCategory] = useState("all");

  const list = useMemo(() => {
    if (category === "all") return destinations;
    return destinations.filter((item) => item.categories.includes(category));
  }, [category, destinations]);

  return (
    <div>
      <CategoryFilter
        categories={DESTINATION_CATEGORIES}
        value={category}
        onChange={setCategory}
      />
      {list.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted">No hay destinos en esta categoría.</p>
      )}
    </div>
  );
}
