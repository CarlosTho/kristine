# Kristine’s blog (chikis)

Hi amor.

This is your little notebook on te internet. A place for your law journey, your thoughts, and whatever else you feel like writing <3

---

When people find it on Google, they’ll see your name and a short line about your law journey before they click.

---

## What I used:

This is a real app, not a static page:

| Piece               | Why                                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| **Next.js + React** | The site itself : fast pages, forms, your studio                               |
| **Tailwind**        | The notebook look (cream paper, red margin, brass)                             |
| **Supabase**        | The database: Postgres for posts, Auth so only you sign in, Storage for photos |
| **Vercel**          | Where it can go live                                                           |

Supabase is your words live in a real database, with rules so strangers can read published notes but only you can write!

There’s also a sitemap, titles/descriptions, and share previews so the site is ready for Google once it’s deployed.

---

JUST IN CASE YOU WANT DO DOWNLOAD IT ON YOUR DESKTOP (SUPER OPTIONAL). This is just for me in case something goes wrong with it :)

## Download it from GitHub

You don’t need to rebuild the database. The site already lives in Supabase you just need this code plus the keys I’ll send you.

1. On GitHub, click the green **Code** button → **Download ZIP** (or Clone if you like).
2. Unzip it somewhere easy, like your Desktop.
3. Install **Node.js LTS** from [nodejs.org](https://nodejs.org) if you don’t have it (the one that says LTS).
4. Open a terminal in that folder and run:

```bash
npm install
```

1. Copy `.env.example` and rename the copy to `.env.local`.
2. Text or email me — I’ll send the three lines to paste in (URL, key, your email). **Don’t put those on GitHub.**
3. Then:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000). Your studio is [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

(The SQL files in `supabase/` are only if someone is setting the project up from zero. You already have a home in the cloud.)

---

Kristine. I made this for you because I believe in the lawyer you’re becoming, and I wanted you to have something for the studying, the late-night notes, or to show off in your interivew :) Write when you want. I’ll be proud either way AMOR

Love,  
Carlos  
<3
