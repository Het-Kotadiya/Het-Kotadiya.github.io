# CLAUDE.md

Personal site for hetkotadiya.com. It's a plain **Jekyll** site built and hosted by **GitHub Pages**. There's no build script, no `package.json`, no Gemfile, and no GitHub Actions workflow. GitHub builds the site itself whenever something is pushed to `main`. The owner usually edits through the GitHub web UI ("Add files via upload"), so keep changes simple and easy to edit by hand.

## How the site is put together

| Path | Role |
|---|---|
| `_config.yml` | Site settings that Jekyll reads (see below). |
| `CNAME` | Custom domain `hetkotadiya.com` for GitHub Pages. |
| `index.html` | Home page: bento-grid tiles, plus the 3 latest posts (or a "coming soon" card when there are none). |
| `writing/index.html` | Writing index at `/writing/`. Lists every post, grouped by year, with a post counter. It holds **no articles itself**. |
| `404.html` | Not-found page. |
| `_layouts/post.html` | Article design: title card, date, read time (words ÷ 200), summary, tag chips, optional cover image, body, and older/newer links. |
| `_includes/head.html` | `<head>` for every page: title, meta description, Open Graph tags, RSS link, CSP, fonts, CSS/JS. |
| `_includes/header.html`, `footer.html` | Top nav (with theme toggle) and footer. |
| `_includes/post-list.html` | One row per post (date, title, summary, first tag). Used by the home page and the writing page. |
| `_includes/images.html` | Puts 2–3 images side by side inside a post. |
| `assets/css/site.css` | All styles. Colors and the accent are at the top, and dark mode is included. |
| `assets/js/site.js` | Theme switch (saved in localStorage), scroll-in fade, header line on scroll, custom cursor. |
| `resume.pdf` | Linked from the nav and the contact section. |

Every page starts with a `---` front-matter block (even an empty one). That block is what tells Jekyll to run the Liquid (`{% include %}`, `{{ site.posts }}`) in the file.

## Publishing a new post

**Posts go in `_posts/`, not `writing/`.** The `/writing/...` URLs come from `permalink` in `_config.yml`, not from the folder the file sits in. A `.md` file placed directly in `writing/` would become a plain page. It would get no post layout and would not show up in the lists.

1. Copy `POST-TEMPLATE.md` to `_posts/YYYY-MM-DD-short-name.md`, for example `_posts/2026-11-20-collusion-sprint.md`. Create the `_posts/` folder if it's missing; it was deleted along with the old demo post.
   - The **date in the filename** is the publish date. It's shown on the post and sets the sort order.
   - The **short name** becomes the URL: `hetkotadiya.com/writing/short-name/`.
2. Fill in the front matter:
   - `title` (required), `summary` (shown in lists, at the top of the article, and in link previews), `tags` (the first tag appears in lists).
   - `image`, `image_alt`, `image_caption` are optional, for the cover image. Delete all three lines if there's no cover.
   - Don't set `layout`. `_config.yml` defaults applies `layout: post` to every post.
3. Write the body in Markdown (GitHub-flavored). The template shows headings, lists, quotes, code blocks, tables, a single image with a caption (an `*italic*` line right under the image), and the `{% include images.html files="a | b" alts="..." caption="..." %}` gallery.
4. Put images under `assets/images/<post-name>/` and reference them with paths that start at the root (`/assets/images/...`). The CSP in `head.html` (`img-src 'self' data:`) **blocks images hosted on other sites**, so every image has to live in the repo.
5. Commit and push to `main`. GitHub Pages rebuilds in a minute or two. The post then appears on `/writing/`, in the home page's "Writing" section, in `/feed.xml`, and in the sitemap.

Gotchas:
- GitHub Pages does **not** publish posts dated in the future. Use today's date or an earlier one.
- `POST-TEMPLATE.md` is listed in `exclude`, so the template is never published. Don't remove it from that list.
- Draft posts can't be hidden. Anything in `_posts/` is live once pushed.

## What `_config.yml` controls

- `title`, `author`, `description`: site name (browser tab, footer, link previews), author meta tag, and the fallback description for pages that have no `summary` or `description`.
- `url`: the full domain. Used for canonical links, Open Graph URLs, the RSS feed, and the sitemap.
- `permalink: /writing/:title/`: post URL pattern. `:title` is the short-name part of the filename.
- `markdown: kramdown` + `input: GFM` + `syntax_highlighter: rouge`: how Markdown is turned into HTML, with code-block coloring.
- `plugins`: `jekyll-feed` (RSS at `/feed.xml`) and `jekyll-sitemap`. Both are on GitHub Pages' allowed list.
- `exclude`: files kept off the live site (`POST-TEMPLATE.md`, `README.md`, `CLAUDE.md`). **Any new `.md` file in the repo that isn't site content (notes, docs) must be added here.** GitHub Pages turns Markdown files into pages even with no front matter. If such a file contains Liquid-looking text like `{% include %}`, the whole build fails. That happened with `CLAUDE.md` in commit fbe7b35.
- `defaults`: gives every post `layout: post` automatically.

Jekyll only reads `_config.yml` at the start of a build. On GitHub Pages every push is a fresh build, so changes take effect on the next push.

## Known loose ends (as of 2026-11-11)

- `head.html` in the repo root is an exact copy of `_includes/head.html`. It isn't used, and because it has no front matter it gets published as a raw file at `/head.html`. The real one is `_includes/head.html`. The root copy can be deleted.
- `assets/images/demo/*.png` are left over from the deleted demo post (`git show e672382` shows it as a working example).
- `index.html` has `TODO` comments: the project card still links to the GitHub profile, not to specific repos.
- `index.html` links to `/writing/` and `/resume.pdf` directly instead of using `relative_url`. That's fine with the custom domain.

## Previewing locally (optional)

There's no Gemfile. To preview, install Ruby, then run `gem install github-pages` (or `jekyll jekyll-feed jekyll-sitemap`) and `jekyll serve`. Open http://localhost:4000.
