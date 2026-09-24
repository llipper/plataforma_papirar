-- ============================================================================
-- Papirar | Sincronização segura da identidade autenticada
-- ============================================================================

begin;

create or replace function app_sync_authenticated_user(
  p_auth_subject varchar(255),
  p_email varchar(320),
  p_display_name varchar(160)
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
begin
  if btrim(coalesce(p_auth_subject, '')) = ''
     or btrim(coalesce(p_email, '')) = '' then
    raise exception 'Authenticated identity is incomplete.'
      using errcode = '22023';
  end if;

  return query
  insert into app_users (auth_subject, email, display_name)
  values (btrim(p_auth_subject), lower(btrim(p_email)), nullif(btrim(p_display_name), ''))
  on conflict (auth_subject)
  do update set
    email = excluded.email,
    display_name = excluded.display_name,
    updated_at = now()
  returning
    app_users.id,
    app_users.auth_subject,
    app_users.email,
    app_users.display_name,
    app_users.is_active;
end;
$$;

revoke all on function app_sync_authenticated_user(varchar, varchar, varchar) from public;

comment on function app_sync_authenticated_user(varchar, varchar, varchar) is
  'Sincroniza uma identidade Firebase verificada com app_users; não concede papel.';

commit;
