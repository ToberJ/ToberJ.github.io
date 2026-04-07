# Taoyang Jia's Personal Website

Source code for my personal academic website, built with Jekyll and GitHub Pages.

## Setup

### 1. Create the GitHub repo
On GitHub, create a new repository named **`toberjia.github.io`** (must match your GitHub username exactly). Once you push to it, GitHub Pages will automatically build and serve the site at `https://toberjia.github.io`.

### 2. Push this folder
```bash
cd toberjia.github.io
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/toberjia/toberjia.github.io.git
git push -u origin main
```

Then go to the repo's **Settings → Pages** and make sure the source is set to "Deploy from a branch" → `main` → `/ (root)`.

### 3. Local preview (optional)
```bash
# With Jekyll (recommended)
bundle install
bundle exec jekyll serve
# Visit http://localhost:4000
```

## Customizing

### Bio / News / Education
Edit `index.md`. The bio, news, education, and any other sections are all in this single file.

### Adding a publication
Edit `publications.json`. Each entry looks like:

```json
{
  "id": "paper-id",
  "title": "Paper Title",
  "authors": ["Author 1", "Taoyang Jia", "Author 3"],
  "venue": "Conference Name",
  "year": "2026",
  "image": "img/papers/your-image.png",
  "links": {
    "arxiv": "https://arxiv.org/abs/...",
    "code": "https://github.com/...",
    "website": "https://..."
  },
  "selected": true,
  "tldr": "Brief summary of the paper..."
}
```

- Set `"selected": true` to show on the main "Selected" view, otherwise it only appears under "All Publications"
- Your name (`Taoyang Jia`) will be auto-bolded — this is configured at the top of `assets/js/publications.js` via the `MY_NAME` constant
- Drop the paper teaser image into `img/papers/`

### Profile photo
Replace `img/taoyang.jpg` with your photo (keep the same filename, or update the references in `index.md` and `_config.yml`).

### CV
Drop your CV PDF at `files/taoyang_cv.pdf` (the link in `index.md` already points there).

### Email / social links
Update the `profile-links` line in `index.md` (currently has placeholder `YOUR_EMAIL@cs.washington.edu`).

## File Structure

```
├── _layouts/
│   └── default.html       # Page template
├── assets/
│   ├── css/style.scss     # Styles
│   └── js/publications.js # Publication renderer
├── img/
│   ├── taoyang.jpg        # Profile photo (add this)
│   └── papers/            # Paper teaser images
├── files/
│   └── taoyang_cv.pdf     # CV (add this)
├── publications.json      # Publication data
├── index.md               # Main page
└── _config.yml            # Jekyll config
```

## Credits
Adapted from [weikaih04.github.io](https://github.com/weikaih04/weikaih04.github.io).
