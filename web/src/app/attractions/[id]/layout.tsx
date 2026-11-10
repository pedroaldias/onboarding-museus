import type { Metadata } from "next";

export const metadata: Metadata = { title: "Atração" };

export default function AttractionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
