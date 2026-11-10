import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

// Só duas famílias, ambas em variable font e self-hosted pelo next/font
// (sem requisição ao Google em runtime e sem layout shift).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Acervo — Atrações e Obras", template: "%s · Acervo" },
  description:
    "Cadastro de atrações de museus e das obras que fazem parte de cada acervo.",
};

function BrandMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 20h18" />
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${fraunces.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-paper font-sans text-ink antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Ir para o conteúdo
        </a>

        <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-xl tracking-tight text-accent"
            >
              <BrandMark />
              <span className="text-ink">Acervo</span>
            </Link>
          </div>
        </header>

        <main
          id="conteudo"
          className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14"
        >
          {children}
        </main>

        <footer className="border-t border-line py-6 text-center text-sm text-muted">
          Acervo · Atrações e obras de museus
        </footer>
      </body>
    </html>
  );
}
