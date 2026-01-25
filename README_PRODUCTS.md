# Product Case Studies System

## Simple Structure

Just add markdown files to the `data/products/` folder. That's it!

## Adding a New Product

### 1. Create a markdown file in `data/products/`

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

### 2. Add the filename to `data/products-list.json`

```json
[
  "sample-product.md",
  "my-awesome-product.md"
]
```

### 3. Add a thumbnail image (optional)

Place at: `assets/img/products/my-awesome-product.jpg`

That's it! The system will automatically:
- Display your product on the My Work page
- Create a detail page at `product.html?slug=my-awesome-product`
- Parse and format your markdown content

## Frontmatter Fields

- `title`: Product name
- `slug`: URL-friendly ID (used in the URL)
- `description`: One-line summary shown on cards
- `thumbnail`: Path to image (optional)
- `category`: Category badge (e.g., "Product Management")
- `date`: Date in YYYY-MM-DD format
- `tags`: Array of tags like `[Tag1, Tag2, Tag3]`

## Markdown Support

The system supports:
- Headers: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- Lists: `- item` or `1. item`
- Blockquotes: `> quote`
- Code blocks: ` ```code``` `
- Horizontal rules: `---`

## File Structure

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

## That's All!

No complicated nested structures. Just markdown files and a simple list.
