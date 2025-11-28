-- Create reports table for anonymous submissions
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type text NOT NULL,
  community_name text,
  encrypted_description text NOT NULL,
  encrypted_evidence text,
  incident_date date,
  report_hash text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS but make it public for anonymous submissions
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reports (anonymous submission)
CREATE POLICY "Anyone can submit anonymous reports"
ON public.reports
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can view reports
CREATE POLICY "Only authenticated users can view reports"
ON public.reports
FOR SELECT
TO authenticated
USING (true);

-- Create index on report_hash for quick verification lookups
CREATE INDEX idx_reports_hash ON public.reports(report_hash);

-- Create index on created_at for sorting
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);