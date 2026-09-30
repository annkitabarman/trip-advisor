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
  address: {
    city: string;
    country: string;
    postcode: number;
    country_code: string;
  };
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

export type PlaceCoords = {
  country: string;
  timezone: string;
  name: string;
  lon: number;
  lat: number;
  population: number;
};

type WikimediaImage = {
  url: string;
  title: string;
};

const OPEN_TRIP_MAP_URL = "https://api.opentripmap.com/0.1";

export async function getPlaceDetails(
  xid: string,
): Promise<OpenTripMapDetails> {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is not defined");
  }

  const url = new URL(`${OPEN_TRIP_MAP_URL}/en/places/xid/${xid}`);

  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, {
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch details for ${xid}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export function normalizeImageUrl(size: number, url?: string) {
  if (!url) return undefined;

  if (url.includes("upload.wikimedia.org")) {
    return url.replace(/\/\d+px-/, `/${size}px-`);
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
    uniquePlaces.slice(0, 10).map(async (place) => {
      try {
        const details = await getPlaceDetails(place.xid);

        return {
          id: place.xid,
          name: details.name || place.name,
          description:
            details.wikipedia_extracts?.text ||
            (details.info?.descr_language === "en"
              ? details.info.descr
              : undefined) ||
            "No description available.",
          image: normalizeImageUrl(500, details.preview?.source),
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

export async function getPlaceCoordinates(query: string): Promise<PlaceCoords> {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is not defined");
  }

  const url = new URL(`${OPEN_TRIP_MAP_URL}/en/places/geoname`);
  url.searchParams.set("name", query);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to search places: ${response.status} ${response.statusText}`,
    );
  }

  const data: PlaceCoords = await response.json();
  return data;
}

export async function getPlaceImages(
  placeName: string,
): Promise<WikimediaImage[]> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");

  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", placeName);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "6");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url");
  url.searchParams.set("iiurlwidth", "1200");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const response = await fetch(url, {
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Wikimedia images");
  }

  const data = await response.json();

  const pages = Object.values(data.query?.pages ?? {}) as {
    title: string;
    imageinfo?: {
      thumburl?: string;
      url?: string;
    }[];
  }[];

  return pages
    .map((page) => ({
      title: page.title,
      url: page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url,
    }))
    .filter((image): image is WikimediaImage => Boolean(image.url));
}
