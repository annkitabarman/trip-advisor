type OpenTripMapPlace = {
  xid: string;
  name: string;
  dist: number;
  kind: string;
  point: {
    lat: number;
    lon: number;
  };
  wikidata: string;
};

type OpenTripMapDetails = {
  xid: string;
  name: string;
  kinds?: string;
  point?: {
    lat: number;
    lon: number;
  };
  info?: {
    descr?: string;
    descr_language?: string;
  };
  wikipedia_extracts?: {
    title?: string;
    text?: string;
    html?: string;
  };
  preview?: {
    source?: string;
    height?: number;
    width?: number;
  };
};

export type Place = {
  id: string;
  name: string;
  description: string;
  image?: string;
  kind: string;
  latitude: number;
  longitude: number;
};

const OPEN_TRIP_MAP_URL = "https://api.opentripmap.com/0.1";

async function getPlaceDetails(xid: string): Promise<OpenTripMapDetails> {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is not defined");
  }

  const response = await fetch(
    `${OPEN_TRIP_MAP_URL}/en/places/xid/${xid}?apikey=${apiKey}`,
    {
      next: {
        revalidate: 86400,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch details for ${xid}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

function normalizeImageUrl(url?: string) {
  if (!url) return undefined;

  if (url.includes("upload.wikimedia.org")) {
    return url.replace(/\/\d+px-/, "/500px-");
  }

  return url;
}

export async function getPlaces(lat: number, lon: number): Promise<Place[]> {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is not defined");
  }

  const url = new URL(`${OPEN_TRIP_MAP_URL}/en/places/radius`);

  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lon.toString());
  url.searchParams.set("radius", "5000");
  url.searchParams.set("limit", "10");
  url.searchParams.set("rate", "2");
  url.searchParams.set("format", "json");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, {
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch places: ${response.status} ${response.statusText}`,
    );
  }

  const places: OpenTripMapPlace[] = await response.json();

  const uniquePlaces = Array.from(
    new Map(places.map((place) => [place.wikidata, place])).values(),
  );

  // Only fetch details for the first 3 places for now.
  const placesWithDetails = await Promise.all(
    uniquePlaces.slice(0, 3).map(async (place) => {
      try {
        const details = await getPlaceDetails(place.xid);

        return {
          id: place.xid,
          name: details.name || place.name,
          description:
            details.info?.descr ||
            details.wikipedia_extracts?.text ||
            "No description available.",
          image: normalizeImageUrl(details.preview?.source),
          kind: details.kinds || place.kind,
          latitude: details.point?.lat ?? place.point.lat,
          longitude: details.point?.lon ?? place.point.lon,
        };
      } catch (error) {
        console.error(`Failed to fetch details for ${place.xid}`, error);

        return {
          id: place.xid,
          name: place.name,
          description: "No description available.",
          image: undefined,
          kind: place.kind,
          latitude: place.point.lat,
          longitude: place.point.lon,
        };
      }
    }),
  );

  return placesWithDetails;
}
