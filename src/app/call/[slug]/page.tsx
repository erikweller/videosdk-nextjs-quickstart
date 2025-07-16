import { notFound } from "next/navigation";
import Script from "next/script";
import VideochatClientWrapper from "@/components/VideochatClientWrapper";

type PageProps = {
  params: { slug: string };
  searchParams: {
    name?: string;
    sdkKey?: string;
    signature?: string;
    role?: string;
    topic?: string;
  };
};

export default function Page({ params, searchParams }: PageProps) {
  const { topic, name, sdkKey, signature, role } = searchParams;

  if (!topic || !name || !sdkKey || !signature || !role) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideochatClientWrapper slug={topic} JWT={signature} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}
