CREATE TABLE partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name varchar(255) NOT NULL,
  partner_code varchar(255),
  referral_link text,
  dashboard_url text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on partnerships"
  ON partnerships FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
