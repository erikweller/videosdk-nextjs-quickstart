import Script from "next/script";
import { notFound } from "next/navigation";
import VideochatClientWrapper from "@/components/VideochatClientWrapper";

// ✅ DO NOT mark this as async unless you are awaiting something!
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
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
