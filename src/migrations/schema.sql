create table public.adoption_requests (
    id uuid not null default gen_random_uuid (),
    pet_id uuid not null,
    user_id uuid not null,
    full_name text not null,
    email text not null,
    phone text null,
    address text null,
    occupation text null,
    reason text null,
    status text not null default 'pending'::text,
    created_at timestamp with time zone not null default now(),
    confirm_safe boolean not null default false,
    confirm_allergies boolean null,
    confirm_food boolean null,
    confirm_attention boolean null,
    confirm_vet boolean null,
    shelter_id uuid null default auth.uid (),
    updated_at timestamp with time zone null,
    constraint adopt_pkey primary key (id),
    constraint adopt_pet_id_fkey foreign KEY (pet_id) references pets (id) on delete CASCADE,
    constraint adopt_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
    constraint adoption_requests_shelter_id_fkey foreign KEY (shelter_id) references shelter (id),
    constraint adoption_requests_status_check check (
        (
            status = any (
                array [
          'pending'::text,
          'approved'::text,
          'contacting_applicant'::text,
          'not_approved'::text,
          'withdrawn'::text,
          'adopted'::text,
          'under_review'::text
        ]
            )
        )
    )
) TABLESPACE pg_default;
create unique INDEX IF not exists adoption_requests_unique_user_pet on public.adoption_requests using btree (pet_id, user_id) TABLESPACE pg_default;
create table public.donation (
    id uuid not null default gen_random_uuid (),
    shelter_id uuid null,
    type text null,
    item_name text [] null,
    method text null,
    account_name text null,
    account_number text null,
    qr_url text null,
    is_active boolean null default true,
    created_at timestamp with time zone null default now(),
    instruction_note text null,
    constraint donation_pkey primary key (id),
    constraint donation_shelter_id_fkey foreign KEY (shelter_id) references shelter (id) on delete CASCADE,
    constraint donation_type_check check (
        (
            type = any (array ['goods'::text, 'monetary'::text])
        )
    )
) TABLESPACE pg_default;
create table public.foster (
    id uuid not null default gen_random_uuid (),
    pet_id uuid not null default auth.uid (),
    title text null,
    description text null,
    created_at timestamp with time zone null,
    constraint foster_pkey primary key (id),
    constraint foster_petID_fkey foreign KEY (pet_id) references pets (id)
) TABLESPACE pg_default;
create index IF not exists foster_pet_id_idx on public.foster using btree (pet_id) TABLESPACE pg_default;
create index IF not exists foster_created_at_idx on public.foster using btree (created_at desc) TABLESPACE pg_default;
create table public.likes (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    target_type text not null,
    target_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint likes_pkey primary key (id),
    constraint likes_user_id_target_type_target_id_key unique (user_id, target_type, target_id),
    constraint likes_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
    constraint likes_target_type_check check (
        (
            target_type = any (
                array ['pet'::text, 'shelter'::text, 'video'::text]
            )
        )
    )
) TABLESPACE pg_default;
create index IF not exists likes_target_idx on public.likes using btree (target_type, target_id) TABLESPACE pg_default;
create index IF not exists likes_user_idx on public.likes using btree (user_id) TABLESPACE pg_default;
create table public.message_threads (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    shelter_id uuid not null,
    adoption_request_id uuid null,
    subject text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    last_message_at timestamp with time zone not null default now(),
    last_message_preview text null,
    created_by_user boolean not null default true,
    thread_type text not null default 'general'::text,
    constraint message_threads_pkey primary key (id),
    constraint message_threads_adoption_request_id_fkey foreign KEY (adoption_request_id) references adoption_requests (id) on delete
    set null,
        constraint message_threads_shelter_id_fkey foreign KEY (shelter_id) references shelter (id) on delete CASCADE,
        constraint message_threads_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
        constraint message_threads_adoption_consistency check (
            (
                (
                    (thread_type = 'general'::text)
                    and (adoption_request_id is null)
                )
                or (
                    (thread_type = 'adoption'::text)
                    and (adoption_request_id is not null)
                )
            )
        )
) TABLESPACE pg_default;
create table public.messages (
    id uuid not null default gen_random_uuid (),
    thread_id uuid not null,
    sender_user_id uuid null,
    sender_shelter_id uuid null,
    body text not null,
    created_at timestamp with time zone not null default now(),
    read_by_user boolean not null default false,
    read_by_shelter boolean not null default false,
    constraint messages_pkey primary key (id),
    constraint messages_sender_shelter_id_fkey foreign KEY (sender_shelter_id) references shelter (id) on delete
    set null,
        constraint messages_sender_user_id_fkey foreign KEY (sender_user_id) references users (id) on delete
    set null,
        constraint messages_thread_id_fkey foreign KEY (thread_id) references message_threads (id) on delete CASCADE,
        constraint messages_exactly_one_sender check (
            (
                (
                    (sender_user_id is not null)
                    and (sender_shelter_id is null)
                )
                or (
                    (sender_user_id is null)
                    and (sender_shelter_id is not null)
                )
            )
        )
) TABLESPACE pg_default;
create table public.pet_media (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    pet_id uuid null default auth.uid (),
    url text null,
    type text null,
    caption text null,
    constraint pet_media_pkey primary key (id),
    constraint pet_media_pet_id_fkey foreign KEY (pet_id) references pets (id) on delete CASCADE,
    constraint pet_media_type_check check (
        (
            type = any (array ['video'::text, 'photo'::text])
        )
    )
) TABLESPACE pg_default;
create index IF not exists pet_media_pet_id_idx on public.pet_media using btree (pet_id) TABLESPACE pg_default;
create index IF not exists pet_media_pet_id_type_idx on public.pet_media using btree (pet_id, type) TABLESPACE pg_default;
create table public.pets (
    id uuid not null default gen_random_uuid (),
    shelter_id uuid null default auth.uid (),
    name text null,
    description text null,
    sex text not null,
    breed text null,
    age text null,
    status text null default 'available'::text,
    created_at timestamp with time zone not null default now(),
    species text null,
    size text null,
    vaccinated boolean null,
    spayed_neutered boolean null,
    photo_url text null,
    "year_inShelter" smallint null,
    constraint pet_pkey primary key (id),
    constraint pets_shelter_id_fkey1 foreign KEY (shelter_id) references shelter (id),
    constraint pets_age_check check (
        (
            age = any (
                array [
          'kitten/puppy'::text,
          'young_adult'::text,
          'adult'::text,
          'senior'::text
        ]
            )
        )
    ),
    constraint pets_size_check check (
        (
            size = any (
                array ['small'::text, 'medium'::text, 'large'::text]
            )
        )
    ),
    constraint pets_species_check check (
        (species = any (array ['cat'::text, 'dog'::text]))
    ),
    constraint pets_status_check check (
        (
            status = any (
                array [
          'available'::text,
          'adopted'::text,
          'pending'::text
        ]
            )
        )
    )
) TABLESPACE pg_default;
create index IF not exists idx_pet_shelter on public.pets using btree (shelter_id) TABLESPACE pg_default;
create index IF not exists pets_created_at_idx on public.pets using btree (created_at desc) TABLESPACE pg_default;
create index IF not exists pets_status_idx on public.pets using btree (status) TABLESPACE pg_default;
create index IF not exists pets_shelter_id_idx on public.pets using btree (shelter_id) TABLESPACE pg_default;
create table public.shelter (
    id uuid not null default gen_random_uuid (),
    shelter_name text not null,
    about text null,
    id_url text null,
    photo_url text null,
    cert_url text null,
    created_at timestamp with time zone null,
    location text not null,
    logo_url text null,
    owner_id uuid null default auth.uid (),
    contact_email text null,
    contact_phone text null,
    lease_url text null,
    application_status text null default 'pending'::text,
    application_submitted_at timestamp with time zone null default now(),
    application_reviewed_at timestamp with time zone null,
    application_review_note text null,
    reviewed_by uuid null,
    updated_at timestamp with time zone null,
    constraint shelter_pkey primary key (id),
    constraint shelter_owner_id_unique unique (owner_id),
    constraint unique_owner unique (owner_id),
    constraint shelter_owner_id_fkey foreign KEY (owner_id) references users (id),
    constraint shelters_application_status_check check (
        (
            application_status = any (
                array [
          'pending'::text,
          'under_review'::text,
          'approved'::text,
          'rejected'::text
        ]
            )
        )
    )
) TABLESPACE pg_default;
create unique INDEX IF not exists shelter_id_unique on public.shelter using btree (id) TABLESPACE pg_default;
create trigger on_shelter_created
after
INSERT on shelter for EACH row execute FUNCTION set_user_role_shelter ();
create trigger on_shelter_deleted
after DELETE on shelter for EACH row execute FUNCTION reset_user_role ();
create trigger trg_sync_shelter_contact_from_owner BEFORE
INSERT
    or
update OF owner_id on shelter for EACH row execute FUNCTION sync_shelter_contact_from_owner ();
create table public.users (
    id uuid not null default auth.uid (),
    username text not null,
    role text not null default 'user'::text,
    photo_url text null,
    bio text null,
    contact_email text null,
    created_at timestamp with time zone not null default now(),
    contact_phone text null,
    full_name text not null,
    updated_at timestamp with time zone null default now(),
    constraint user_pkey primary key (id),
    constraint user_username_key unique (username),
    constraint users_contact_email_key unique (contact_email),
    constraint users_username_key unique (username),
    constraint users_username_unique unique (username),
    constraint user_id_fkey foreign KEY (id) references auth.users (id),
    constraint users_role_check check (
        (
            role = any (
                array ['user'::text, 'shelter'::text, 'admin'::text]
            )
        )
    )
) TABLESPACE pg_default;
create trigger update_profiles_updated_at BEFORE
update on users for EACH row execute FUNCTION update_updated_at_column ();
create table public.video_views (
    id uuid not null default gen_random_uuid (),
    media_id uuid not null,
    user_id uuid null,
    session_id text null,
    viewed_at timestamp with time zone not null default now(),
    constraint video_views_pkey primary key (id),
    constraint video_views_media_id_fkey foreign KEY (media_id) references pet_media (id) on delete CASCADE,
    constraint video_views_user_id_fkey foreign KEY (user_id) references users (id) on delete
    set null
) TABLESPACE pg_default;
create index IF not exists idx_video_views_media_id on public.video_views using btree (media_id) TABLESPACE pg_default;
create index IF not exists idx_video_views_user_id on public.video_views using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_video_views_session_id on public.video_views using btree (session_id) TABLESPACE pg_default;
create index IF not exists idx_video_views_viewed_at on public.video_views using btree (viewed_at) TABLESPACE pg_default;
create index IF not exists idx_video_views_media_id_viewed_at on public.video_views using btree (media_id, viewed_at desc) TABLESPACE pg_default;