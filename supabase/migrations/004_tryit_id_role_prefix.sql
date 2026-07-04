-- Migration: role-based TryIT ID prefix
-- Replaces the email/state-initials-based tryit_id generation with a
-- role-based prefix: Student = TRY-STU, Mentor = TRY-MEN,
-- Institution = TRY-INS, Family = TRY-FAM. Keeps the numeric sequence
-- and year suffix as-is. Reads role from the signup metadata
-- (raw_user_meta_data->>'role'), falling back to 'STU' if not provided.

create or replace function handle_new_user()
returns trigger as $$
declare
  role_prefix text;
begin
  role_prefix := case lower(coalesce(NEW.raw_user_meta_data->>'role', 'student'))
    when 'mentor'      then 'MEN'
    when 'institution' then 'INS'
    when 'family'      then 'FAM'
    else 'STU'
  end;

  insert into profiles (id, email, tryit_id)
  values (
    NEW.id,
    NEW.email,
    'TRY-' || role_prefix || '-' || lpad(extract(epoch from now())::int::text, 5, '0') || '-2026'
  );
  return NEW;
end;
$$ language plpgsql security definer;
