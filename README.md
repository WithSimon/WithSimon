# WithSimon

Personal CV/Portfolio website for Simon Tadeu - Senior Product Manager

## About This Project

This is a professional portfolio and CV site showcasing:

- **Professional Profile**: Comprehensive overview of my experience as a Senior Product Manager
- **Career Journey**: Timeline and milestones throughout my professional career
- **Projects & Achievements**: Detailed case studies of projects I've led and contributed to
- **Personal Story**: Who I am beyond the resume
- **Contact & Opportunities**: Ways to connect for career opportunities and collaborations

## Purpose

This site serves as a central hub to:
- Showcase my product management expertise and accomplishments
- Share insights from projects I've been involved in
- Connect with potential employers, collaborators, and the product community
- Tell my professional story in a more dynamic and engaging way than a traditional CV

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

Write your full case study here using markdown...

## The Challenge

What problem were you solving?

## The Solution

How did you approach it?

## Results

What impact did you make?
```

**2. Add the filename to `data/products-list.json`**

```json
[
  "sample-product.md",
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
- `date`: Date in YYYY-MM-DD format
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
    sample-product.md
    my-awesome-product.md
  products-list.json
assets/
  img/
    products/
      sample-product.jpg
      my-awesome-product.jpg
  js/
    products.js
```

### Local Development

To view products locally, run a web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/my-work.html`

---

## Get In Touch

Interested in working together or learning more about my experience? Visit the site to find contact information and ways to connect.
