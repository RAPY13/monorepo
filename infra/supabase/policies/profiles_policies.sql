alter table profiles enable row level security;

create policy "profiles_select_own"
on profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
