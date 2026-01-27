import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oasis de Fragancias - Perfumería y Cuidado Personal",
    short_name: "Oasis de Fragancias",
    description: "Tienda de productos de perfumería y cuidado personal",
    start_url: "/",
    display: "standalone",
    background_color: "#f5e1ce",
    theme_color: "#96305a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
