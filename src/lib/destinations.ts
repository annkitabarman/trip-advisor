export const destinations = {
  tokyo: {
    name: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
  },

  kyoto: {
    name: "Kyoto",
    latitude: 35.0116,
    longitude: 135.7681,
  },

  osaka: {
    name: "Osaka",
    latitude: 34.6937,
    longitude: 135.5023,
  },
} as const;

export type DestinationSlug = keyof typeof destinations;
