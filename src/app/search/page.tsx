import { getPlaceCoordinates, getPlaces, Place } from "@/lib/opentripmap";
import PlaceCard from "@/components/PlaceCard";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  let places: Place[] = [];

  if (q) {
    const location = await getPlaceCoordinates(q);

    places = (await getPlaces(location.lat, location.lon)).filter(
      (place) => place.name !== "",
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 mt-10">
      {q && <p className="mb-6">Places near {q}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <PlaceCard
            id={place.id}
            key={place.id}
            name={place.name}
            description={place.description}
            image={place.image}
            kinds={place.kind}
          />
        ))}
      </div>
    </main>
  );
}
