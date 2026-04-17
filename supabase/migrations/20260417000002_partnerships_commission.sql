alter table partnerships
  add column if not exists commission_payout numeric(10,2),
  add column if not exists first_time_commission numeric(10,2),
  add column if not exists recurring_commission numeric(10,2);

comment on column partnerships.commission_payout is 'General commission payout amount or percentage';
comment on column partnerships.first_time_commission is 'Commission on a customer''s first purchase';
comment on column partnerships.recurring_commission is 'Commission on repeat/recurring purchases';
