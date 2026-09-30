import Link from "next/link";

type PlaceCardProps = {
  id: string;
  name: string;
  description: string;
  image?: string;
  kinds?: string;
};

export default function PlaceCard({
  id,
  name,
  description,
  image,
  kinds,
}: PlaceCardProps) {
  const categories = kinds
    ?.split(",")
    .slice(0, 3)
    .map((kind) => kind.replace(/_/g, " "));

  return (
    <Link href={`places/${id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        {image && (
          <img src={image} alt={name} className="h-48 w-full object-cover" />
        )}

        <div className="p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {categories?.map((category) => (
              <span
                key={category}
                className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium capitalize text-purple-700"
              >
                {category}
              </span>
            ))}
          </div>

          <h2 className="mb-2 text-xl font-semibold text-gray-900">{name}</h2>

          <p className="line-clamp-4 text-sm leading-6 text-gray-600">
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}
