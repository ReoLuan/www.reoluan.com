-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create the newsletter_subscribers table
create table if not exists newsletter_subscribers (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    interests text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
); 