import { NextResponse } from "next/server";
import { requireActiveProfile } from "@/lib/auth/session";
import { getResumeData } from "@/lib/db/candidates";
import { renderResumeHtml } from "@/lib/resume/template";

/**
 * Renders a candidate's branded résumé as a standalone HTML page (outside the
 * dashboard shell) for on-screen preview and browser "Print → Save as PDF".
 * The résumé is built live from the candidate's current profile data, so the
 * preview always reflects the latest edits — independent of the stored
 * `generated_resume` snapshot. Access is RLS-scoped via getResumeData.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Redirects to /login if not an active staff member.
  await requireActiveProfile();

  const { id } = await params;
  const data = await getResumeData(id);
  if (!data) {
    return new NextResponse("Candidate not found or not accessible.", {
      status: 404,
    });
  }

  const html = renderResumeHtml(data);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Never cache a résumé preview — it must reflect current profile data.
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
