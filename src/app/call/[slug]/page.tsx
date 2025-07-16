import { notFound } from "next/navigation";
import VideochatClientWrapper from "@/components/VideochatClientWrapper";
import Script from "next/script";

type CallPageProps = {
  params: { slug: string };
  searchParams?: {
    name?: string;
    sdkKey?: string;
    signature?: string;
    role?: string;
    topic?: string;
  };
};

export default async function Page({ params, searchParams }: CallPageProps) {
  const { slug } = params;
  const { name, sdkKey, signature, role, topic } = searchParams || {};

  if (!name || !sdkKey || !signature || !role || !topic) {
    return notFound(); // Could also render a nicer fallback UI here
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideochatClientWrapper slug={topic} JWT={signature} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}
