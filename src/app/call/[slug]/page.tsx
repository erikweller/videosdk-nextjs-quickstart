import { getData } from "@/data/getToken";
import VideochatClientWrapper from "@/components/VideochatClientWrapper";
import Script from "next/script";
import { notFound } from "next/navigation";

export default async function Page({ params, searchParams }: {
  params: { slug: string };
  searchParams: {
    name?: string;
    sdkKey?: string;
    signature?: string;
    role?: string;
    topic?: string;
  };
}) {
  const { name, sdkKey, signature, role, topic } = searchParams;

  if (!name || !sdkKey || !signature || !role || !topic) {
    return notFound(); // or custom error UI
  }

  const JWT = signature; // You already have it from your script

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideochatClientWrapper slug={topic} JWT={JWT} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}
