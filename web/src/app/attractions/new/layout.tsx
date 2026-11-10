import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova atração" };

export default function NewAttractionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
