import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display text-display mt-4 font-medium tracking-tight">
        Off the map.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        This address doesn&apos;t exist — or the listing has been sold and
        retired. The search below always works.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/properties" size="lg">
          Browse properties
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
