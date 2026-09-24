-- ============================================================================
-- Papirar | Garante que somente entradas ativas recebam a role admin
-- ============================================================================

begin;

create or replace function app_sync_authenticated_user(
  p_auth_subject varchar(255),
  p_email varchar(320),
  p_display_name varchar(160),
  p_email_verified boolean
)
returns table (
  id uuid,
  auth_subject varchar(255),
  email varchar(320),
  display_name varchar(160),
  is_active boolean
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user_id uuid;
  v_email varchar(320) := lower(btrim(p_email));
  v_is_admin boolean := false;
begin
  if btrim(coalesce(p_auth_subject, '')) = ''
     or v_email = '' then
    raise exception 'Authenticated identity is incomplete.'
      using errcode = '22023';
  end if;

  insert into app_users (auth_subject, email, display_name)
  values (btrim(p_auth_subject), v_email, nullif(btrim(p_display_name), ''))
  on conflict (auth_subject)
  do update set
    email = excluded.email,
    display_name = excluded.display_name,
    updated_at = now()
  returning app_users.id into v_user_id;

  if exists (
    select 1
    from app_admin_allowlist
    where is_active = true
      and (
        firebase_uid = btrim(p_auth_subject)
        or (firebase_uid is null and email = v_email and p_email_verified = true)
      )
  ) then
    update app_admin_allowlist
    set firebase_uid = btrim(p_auth_subject)
    where is_active = true
      and firebase_uid is null
      and email = v_email
      and p_email_verified = true;

    v_is_admin := true;
  end if;

  if v_is_admin then
    insert into user_roles (user_id, role)
    values (v_user_id, 'admin')
    on conflict (user_id, role) do nothing;
  else
    delete from user_roles
    where user_id = v_user_id and role = 'admin';
  end if;

  return query
  select au.id, au.auth_subject, au.email, au.display_name, au.is_active
  from app_users au
  where au.id = v_user_id;
end;
$$;

revoke all on function app_sync_authenticated_user(varchar, varchar, varchar, boolean) from public;

commit;
