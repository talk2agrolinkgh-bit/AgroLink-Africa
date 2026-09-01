// src/app/admin/(dashboard)/cms/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { CmsEditor } from "@/components/admin/CmsEditor";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const blocks = await db.siteContent.findMany({ orderBy: { label: "asc" } });

  return (
    <>
      <PageHeader eyebrow="Content" title="CMS" action={<span className="text-xs text-ink-soft self-center">Edit homepage copy without a deploy</span>} />
      <CmsEditor initialBlocks={blocks} />
    </>
  );
}
