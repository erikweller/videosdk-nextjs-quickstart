import { notFound } from "next/navigation";
import Script from "next/script";
import VideochatClientWrapper from "@/components/VideochatClientWrapper";

type PageProps = {
  params: { slug: string };
  searchParams: Record<string, string | undefined>;
};

export default function Page({ params, searchParams }: PageProps) {
  const { slug } = params;
  const { name, sdkKey, signature, role, topic } = searchParams;

  if (!name || !sdkKey || !signature || !role || !topic) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideochatClientWrapper slug={topic} JWT={signature} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}
