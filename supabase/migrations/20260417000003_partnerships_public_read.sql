create policy "Public can view active partnerships"
  on partnerships for select
  to anon, authenticated
  using (is_active = true);
