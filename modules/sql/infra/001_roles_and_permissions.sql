-- ============================================================================
-- Papirar | Provisionamento de roles do PostgreSQL
--
-- Executar uma única vez por um administrador do cluster, fora do fluxo de
-- migrations da aplicação. Não contém senhas nem cria usuários de login.
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'papirar_migrator') then
    create role papirar_migrator nologin;
  end if;

  if not exists (select 1 from pg_roles where rolname = 'papirar_app') then
    create role papirar_app nologin;
  end if;
end;
$$;

-- O schema público não deve aceitar DDL de qualquer role.
revoke create on schema public from public;
grant usage on schema public to papirar_app;
grant usage on schema public to papirar_migrator;

-- A role de runtime não é dona das tabelas. O acesso às tabelas passa por
-- RLS; as tabelas de auditoria permanecem sem acesso direto.
revoke all on all tables in schema public from papirar_app;
revoke all on all sequences in schema public from papirar_app;
revoke all on all functions in schema public from papirar_app;

grant select, insert, update, delete on all tables in schema public to papirar_app;
grant usage, select on all sequences in schema public to papirar_app;
revoke all on taxonomy_audit_events, question_audit_log from papirar_app;
revoke all on app_admin_allowlist from papirar_app;

grant execute on function app_current_user_id() to papirar_app;
grant execute on function app_is_admin() to papirar_app;
grant execute on function app_current_actor_id() to papirar_app;
grant execute on function app_sync_authenticated_user(varchar, varchar, varchar, boolean) to papirar_app;

-- A role de migration recebe ownership/DDL fora deste arquivo, através do
-- procedimento de deploy controlado. Não concedemos SUPERUSER ao runtime.
alter role papirar_app nosuperuser nocreatedb nocreaterole noreplication;
alter role papirar_migrator nosuperuser nocreatedb nocreaterole noreplication;

comment on role papirar_app is
  'Role sem login para runtime; deve ser usada por um login de aplicação com SET LOCAL app.user_id/app.role.';

comment on role papirar_migrator is
  'Role sem login para aplicar migrations e seeds em pipeline controlado.';
