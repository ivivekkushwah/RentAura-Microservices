import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://rentaura.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://rentaura.vercel.app/login",
    },
    {
      url: "https://rentaura.vercel.app/sign-up",
    },
    {
      url: "https://rentaura.vercel.app/owner/dashboard",
    },
    {
      url: "https://rentaura.vercel.app/browse",
    },
    {
      url: "https://rentaura.vercel.app/owners",
    },
    {
      url: "https://rentaura.vercel.app/roommates",
    },
    {
      url: "https://rentaura.vercel.app/about",
    },
    {
      url: "https://rentaura.vercel.app/contact",
    },
  ];
}
