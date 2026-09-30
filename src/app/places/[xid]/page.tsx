import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPlaceDetails,
  getPlaceImages,
  getPlaceCoordinates,
} from "@/lib/opentripmap";
import ImageCarousel from "@/components/ImageCarousel";

type Props = {
  params: Promise<{
    xid: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { xid } = await params;

  try {
    const place = await getPlaceDetails(xid);

    return {
      title: `${place.name} | TripAdvisor`,
      description:
        place.info?.descr ||
        place.wikipedia_extracts?.text ||
        `Explore ${place.name}.`,
    };
  } catch {
    return {
      title: "Place Not Found | TripAdvisor",
    };
  }
}

export default async function PlacePage({ params }: Props) {
  const { xid } = await params;

  let place;

  try {
    place = await getPlaceDetails(xid);
    console.log(place.address);
  } catch {
    notFound();
  }

  if (!place) {
    notFound();
  }

  const images = await getPlaceImages(place.name);

  const description =
    place.info?.descr ||
    place.wikipedia_extracts?.text ||
    "No description is available for this place.";

  const categories = place.kinds
    ?.split(",")
    .slice(0, 5)
    .map((kind) => kind.replace(/_/g, " "));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Image carousel */}
      <section>
        <ImageCarousel images={images} alt={place.name} />
      </section>

      {/* Place information */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 py-10">
          {/* Place name */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 md:text-6xl">
            {place.name}
          </h1>

          <p className="text-gray-500 pt-2 px-2">
            {place.address?.city}, {place.address?.country}
          </p>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium capitalize text-purple-700"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Actions */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/destinations"
            className="text-sm font-semibold text-gray-500 transition hover:text-purple-600"
          >
            ← Back to destinations
          </Link>

          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-purple-300 hover:text-purple-600"
            >
              ♡ Save
            </button>

            {place.point && (
              <a
                href={`https://www.google.com/maps?q=${place.point.lat},${place.point.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
              >
                📍 View on map
              </a>
            )}
          </div>
        </div>

        {/* About + Location */}
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          {/* About */}
          <article className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-9">
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">
              About
            </h2>

            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {description}
            </p>
          </article>

          {/* Location */}
          <article className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-9">
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">
              Location
            </h2>

            {place.point ? (
              <div className="space-y-5">
                <div>
                  <p className="mb-1 text-sm text-gray-500">Coordinates</p>

                  <p className="font-medium text-gray-900">
                    {place.point.lat.toFixed(4)}°, {place.point.lon.toFixed(4)}°
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-500">Latitude</p>

                  <p className="font-medium text-gray-900">{place.point.lat}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-500">Longitude</p>

                  <p className="font-medium text-gray-900">{place.point.lon}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Location information is unavailable.
              </p>
            )}
          </article>
        </div>

        {/* Wikipedia / additional information */}
        {place.wikipedia_extracts?.text && (
          <article className="mt-6 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-9">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                More about this place
              </h2>

              <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 sm:block">
                Wikipedia
              </span>
            </div>

            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {place.wikipedia_extracts.text}
            </p>
          </article>
        )}
      </section>
    </main>
  );
}
