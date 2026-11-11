---
name: publish
description: Publish a new article to the site from a markdown draft. Use when I say "publish" and give a draft file or paste text.
---

# Publish an article

1. Read `POST-TEMPLATE.md`, `_config.yml` and `CLAUDE.md` first so the new post
   matches the site's conventions exactly (folder, file name, front matter).
2. Take the draft I give you ($ARGUMENTS: a file path, or text I paste).
3. Create the post file in the right place with today's date, a clean slug,
   and the template's front matter filled in.
4. Fix only spelling and grammar. Do NOT change my wording, tone, structure,
   or claims. If a sentence is unclear, ask me instead of rewriting it.
5. Check every link in the post works.
6. Show me the final file and wait for my "yes" before committing.
7. After "yes": commit with a message like "Publish: <title>" and push to main.
8. Tell me the live URL and remind me the site takes about a minute to rebuild.
