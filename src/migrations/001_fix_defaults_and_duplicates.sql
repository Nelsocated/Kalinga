-- Run once in the Supabase SQL editor.
begin;

-- These columns hold pet/shelter IDs, but defaulted to the logged-in user's ID.
-- The app always sets them explicitly, so the default only hides mistakes.
alter table public.pets alter column shelter_id drop default;
alter table public.pet_media alter column pet_id drop default;
alter table public.foster alter column pet_id drop default;
alter table public.adoption_requests alter column shelter_id drop default;

-- users.username had three identical unique constraints; keep users_username_key.
alter table public.users drop constraint if exists user_username_key;
alter table public.users drop constraint if exists users_username_unique;

-- shelter.owner_id had two; keep shelter_owner_id_unique (used by upsert onConflict).
alter table public.shelter drop constraint if exists unique_owner;

-- pets.shelter_id was indexed twice; keep pets_shelter_id_idx.
drop index if exists public.idx_pet_shelter;

-- shelter.id already has a unique index from its primary key. Skip if a foreign key
-- happens to be bound to this copy.
do $$
begin
  drop index if exists public.shelter_id_unique;
exception when dependent_objects_still_exist then
  raise notice 'kept shelter_id_unique: a foreign key depends on it';
end $$;

commit;
