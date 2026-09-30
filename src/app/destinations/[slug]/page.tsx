import type { Metadata } from "next";
import PlaceCard from "@/components/PlaceCard";
import { destinations } from "@/lib/destinations";
import { getPlaces } from "@/lib/opentripmap";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const destination = destinations[slug as keyof typeof destinations];

  if (!destination) {
    return {
      title: "Destination Not Found | Roam",
    };
  }

  return {
    title: `${destination.name} | Roam`,
    description: `Explore places to visit, attractions, and points of interest in ${destination.name}.`,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;

  const destination = destinations[slug as keyof typeof destinations];

  if (!destination) {
    return <h1>Destination not found</h1>;
  }

  const places = await getPlaces(destination.latitude, destination.longitude);
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">{destination.name}</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            id={place.id}
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
