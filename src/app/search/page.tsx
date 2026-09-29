import { searchPlaces } from "@/lib/opentripmap";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const results = q ? await searchPlaces(q) : [];

  console.log(results);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <form action="/search" method="GET" className="mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search for a destination..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        <button
          type="submit"
          className="mt-3 rounded-lg bg-purple-600 px-5 py-3 text-white"
        >
          Search
        </button>
      </form>

      {q && <p>Searching for: {q}</p>}
    </main>
  );
}
