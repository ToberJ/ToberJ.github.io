# Taoyang Jia's Personal Website

Source code for my personal academic website, built with Jekyll and GitHub Pages.

## Setup

### 1. Create the GitHub repo
On GitHub, create a new repository named **`ToberJ.github.io`** (must match your GitHub username). Once you push to it, GitHub Pages will automatically build and serve the site at `https://toberj.github.io`.

### 2. Push this folder
```bash
cd ToberJ.github.io
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ToberJ/ToberJ.github.io.git
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
Replace `img/taoyang.png` with your photo (keep the same filename, or update the references in `_config.yml`).

### CV
No CV is linked yet. To add one, put the PDF at `files/taoyang_cv.pdf` and add a link to it.

### Email / social links
Email, Google Scholar, GitHub and LinkedIn are set under `author:` in `_config.yml`.

## File Structure

```
├── _layouts/
│   └── default.html       # Page template
├── assets/
│   ├── css/style.scss     # Styles
│   └── js/publications.js # Publication renderer
├── img/
│   ├── taoyang.png        # Profile photo
│   └── papers/            # Paper teaser images
├── publications.json      # Publication data
├── index.md               # Main page
└── _config.yml            # Jekyll config
```

## Credits
Adapted from [weikaih04.github.io](https://github.com/weikaih04/weikaih04.github.io).
