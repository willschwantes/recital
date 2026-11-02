create table if not exists public.presentation_control (
    id boolean primary key default true check (id),
    stage integer not null check (stage between -1 and 14)
);

insert into public.presentation_control (id, stage)
values (true, -1)
on conflict (id) do nothing;

create table if not exists public.presentation_content (
    content_id text primary key,
    release_stage integer not null check (release_stage between 0 and 14),
    sort_order integer not null,
    payload jsonb not null check (jsonb_typeof(payload) = 'object')
);

alter table public.presentation_control enable row level security;
alter table public.presentation_content enable row level security;

revoke all on public.presentation_control from anon, authenticated;
revoke all on public.presentation_content from anon, authenticated;
grant all on public.presentation_control to service_role;
grant all on public.presentation_content to service_role;

create or replace function public.get_presentation()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    current_stage integer;
    released_content jsonb;
begin
    select stage
    into current_stage
    from public.presentation_control
    where id = true;

    if current_stage is null then
        raise exception 'Presentation stage is not configured';
    end if;

    select coalesce(
        jsonb_agg(payload order by sort_order, content_id),
        '[]'::jsonb
    )
    into released_content
    from public.presentation_content
    where release_stage <= current_stage;

    return jsonb_build_object(
        'stage', current_stage,
        'content', released_content
    );
end;
$$;

drop function if exists public.set_presentation_stage(integer);
revoke all on function public.get_presentation() from public;
grant execute on function public.get_presentation() to anon, authenticated;
