# WithSimon

Personal CV/Portfolio website for Simon Tadeu - Senior Product Manager

## About This Project

This is a professional portfolio and CV site showcasing:

- **Professional Profile**: Overview of my experience as a Senior Product Manager (home page)
- **Projects**: Case studies in **My Work** — each product has its own detail page built from markdown
- **About**: Personal background and story (timeline/career journey to come)
- **My Thoughts**: Articles and reflections (content coming soon)
- **Get In Touch**: Contact form and links (Netlify form, CV download, email)

## Purpose

This site serves as a central hub to:
- Showcase my product management expertise and accomplishments
- Share insights from projects I've been involved in
- Connect with potential employers, collaborators, and the product community
- Tell my professional story in a more dynamic and engaging way than a traditional CV

---

## Shared header & footer

Nav and footer are in **partials/header.html** and **partials/footer.html**. After editing either:

```bash

node build.js
```

This injects them into all main HTML pages. You can run it before commit/deploy or add it to your deploy step.

---

## Product Case Studies System

### Simple Structure

Just add markdown files to the `data/products/` folder.

### Adding a New Product

**1. Create a markdown file in `data/products/`**

Example: `data/products/my-awesome-product.md`

```markdown
---
title: My Awesome Product
slug: my-awesome-product
description: A brief one-line description of the product
thumbnail: assets/img/products/my-awesome-product.jpg
category: Product Management
date: 2024-12-15
tags: [Strategy, UX, Analytics]
---

# My Awesome Product

Write your full case study here. Use **## headings** for the main sections; they are rendered as styled cards on the product page. Common section names (which get matching icons) include **Context**, **Problem**, **Solution**, **Execution**, **Results**, **Takeaways**.

## Context

Background and setup.

## Problem

What problem were you solving?

## Solution

How did you approach it?

## Results

What impact did you make?
```

**2. Add the filename to `data/products-list.json`**

```json
[
  "bond-heart.md",
  "ecommerce-platform.md",
  "my-awesome-product.md"
]
```

**3. Add a thumbnail image (optional)**

Place at: `assets/img/products/my-awesome-product.jpg`

The system will automatically:
- Display your product on the My Work page
- Create a detail page at `product.html?slug=my-awesome-product`
- Parse and format your markdown content

### Frontmatter Fields

- `title`: Product name
- `slug`: URL-friendly ID (used in the URL)
- `description`: One-line summary shown on cards
- `thumbnail`: Path to image (optional, can use external URL)
- `category`: Category badge (e.g., "Product Management")
- `date`: Date in YYYY-MM-DD or ISO format (e.g. `2023-03-01` or `2023-03-01T00:00:00.000Z`)
- `tags`: Array of tags like `[Tag1, Tag2, Tag3]`

### Markdown Support

- Headers: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- Lists: `- item` or `1. item`
- Blockquotes: `> quote`
- Code blocks: ` ```code``` `
- Horizontal rules: `---`

### File Structure

```
data/
  products/
    bond-heart.md
    ecommerce-platform.md
    my-awesome-product.md
  products-list.json
assets/
  img/
    products/
      bond-heart.jpeg
      my-awesome-product.jpg
  js/
    products.js
```

### Local Development

Products are loaded via `fetch`, so you need a local web server (opening HTML files directly won’t load them):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` (home) or `http://localhost:8000/my-work.html` (projects).

---

## Get In Touch

The **Get In Touch** page (`hire-me.html`) has a Netlify contact form, a link to download the CV (`assets/files/CV.pdf`), and the email hello@withsimon.com.
```