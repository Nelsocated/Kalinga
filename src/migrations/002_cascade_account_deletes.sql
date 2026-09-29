-- Run once in the Supabase SQL editor, after 001.
-- Deleting an account removes the auth user, but public.users (and everything a
-- shelter owns) blocked that delete. These foreign keys now cascade instead.
begin;

-- Replaces whatever FK exists on the column, so it works regardless of the old name.
create function pg_temp.recreate_fk(
  p_table regclass,
  p_column text,
  p_ref regclass,
  p_on_delete text
) returns void
language plpgsql
as $$
declare
  c record;
  v_table_name text := (select relname from pg_class where oid = p_table);
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_attribute att
      on att.attrelid = con.conrelid and att.attnum = con.conkey[1]
    where con.contype = 'f'
      and con.conrelid = p_table
      and con.confrelid = p_ref
      and array_length(con.conkey, 1) = 1
      and att.attname = p_column
  loop
    execute format('alter table %s drop constraint %I', p_table, c.conname);
  end loop;

  execute format(
    'alter table %s add constraint %I foreign key (%I) references %s (id) on delete %s',
    p_table, v_table_name || '_' || p_column || '_fkey', p_column, p_ref, p_on_delete
  );
end $$;

select pg_temp.recreate_fk('public.users', 'id', 'auth.users', 'cascade');
select pg_temp.recreate_fk('public.shelter', 'owner_id', 'public.users', 'cascade');
select pg_temp.recreate_fk('public.pets', 'shelter_id', 'public.shelter', 'cascade');
select pg_temp.recreate_fk('public.foster', 'pet_id', 'public.pets', 'cascade');
select pg_temp.recreate_fk('public.adoption_requests', 'shelter_id', 'public.shelter', 'cascade');

-- A message's sender always owns its thread, so the message goes with the thread.
-- "set null" here broke messages_exactly_one_sender mid-delete.
select pg_temp.recreate_fk('public.messages', 'sender_user_id', 'public.users', 'cascade');
select pg_temp.recreate_fk('public.messages', 'sender_shelter_id', 'public.shelter', 'cascade');

commit;
