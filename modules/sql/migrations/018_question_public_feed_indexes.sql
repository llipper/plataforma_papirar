begin;

create index if not exists questions_public_feed_idx
  on questions (published_at desc, id desc)
  where status = 'published'::question_status
    and visibility = 'public'::question_visibility;

create index if not exists questions_public_discipline_feed_idx
  on questions (discipline_id, published_at desc, id desc)
  where status = 'published'::question_status
    and visibility = 'public'::question_visibility;

create index if not exists questions_public_difficulty_feed_idx
  on questions (question_difficulty_id, published_at desc, id desc)
  where status = 'published'::question_status
    and visibility = 'public'::question_visibility;

comment on index questions_public_feed_idx is
  'Cursor pagination for the public published question feed.';

commit;
