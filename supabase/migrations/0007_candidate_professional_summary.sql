-- Phase 6+ : recruiter-authored professional summary for the generated résumé.
alter table public.candidates
  add column if not exists professional_summary text;

comment on column public.candidates.professional_summary is
  'Recruiter-authored professional summary shown at the top of the generated resume.';
