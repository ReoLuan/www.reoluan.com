# Contact Form Backend

This server handles contact form submissions by:
1. Storing submissions in Supabase
2. Sending email notifications via SendGrid

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create a `.env` file based on `.env.example` and fill in your credentials:
- Get Supabase credentials from your Supabase project settings
- Get SendGrid API key from SendGrid dashboard
- Verify your sender email in SendGrid

3. Create a table in Supabase:
```sql
create table contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

4. Run the server:
```bash
npm run dev
# or
yarn dev
```

## API Endpoint

POST `/api/contact`

Request body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "message": "Contact message"
}
``` 