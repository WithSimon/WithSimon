# Blog System Documentation

## Overview

This portfolio site includes a blog post system that allows you to showcase your product management projects with detailed case study blog posts.

## Architecture

### Data Structure

Projects and blog posts are managed through JSON files:

- **`data/projects.json`** - Main projects database containing all projects and their blog post metadata
- **`data/projects/[project-id]/posts/[post-slug].md`** - Individual blog post content in Markdown format

### Pages

1. **My Work (`my-work.html`)** - Displays all projects as cards
2. **Project Detail (`project.html`)** - Shows project overview and lists all blog posts
3. **Blog Post (`post.html`)** - Displays individual blog post content

### JavaScript System

**`assets/js/blog-system.js`** handles:
- Loading project data from JSON
- Rendering project cards dynamically
- Displaying project details
- Loading and parsing Markdown content
- Rendering blog posts with proper formatting

## Adding a New Project

### 1. Add Project to `data/projects.json`

```json
{
  "id": "your-project-id",
  "title": "Your Project Title",
  "slug": "your-project-slug",
  "description": "Brief project description",
  "thumbnail": "assets/img/projects/your-project-id/thumbnail.jpg",
  "category": "Product Management",
  "date": "2024-12-15",
  "featured": true,
  "overview": {
    "challenge": "What problem did you solve?",
    "solution": "How did you solve it?",
    "impact": "What were the results?"
  },
  "tags": ["Tag 1", "Tag 2", "Tag 3"],
  "blogPosts": [
    {
      "id": "post-1",
      "title": "Your Blog Post Title",
      "slug": "your-post-slug",
      "date": "2024-11-01",
      "excerpt": "Brief post summary",
      "readTime": "5 min read",
      "content": "data/projects/your-project-id/posts/post-1.md"
    }
  ]
}
```

### 2. Create Project Directory

```bash
mkdir -p data/projects/your-project-id/posts
mkdir -p assets/img/projects/your-project-id
```

### 3. Add Thumbnail Image

Place your project thumbnail at:
```
assets/img/projects/your-project-id/thumbnail.jpg
```

Recommended size: 800x600px or similar 4:3 ratio

### 4. Create Blog Post Markdown Files

Create files like `data/projects/your-project-id/posts/post-1.md`:

```markdown
# Your Post Title

## Section Heading

Your content here...

### Subsection

More content...

- Bullet point 1
- Bullet point 2

> Quote or callout text

**Bold text** and *italic text*

[Link text](url)

---

Horizontal rule for separation
```

## Markdown Formatting Guide

The blog system supports:

- **Headers**: `#`, `##`, `###`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Links**: `[text](url)`
- **Blockquotes**: `> quote`
- **Lists**: `- item` or `1. item`
- **Horizontal rules**: `---`

## Project Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique project identifier |
| `title` | string | Project display title |
| `slug` | string | URL-friendly identifier |
| `description` | string | Brief project description |
| `thumbnail` | string | Path to project image |
| `category` | string | Project category (e.g., "Product Management") |
| `date` | string | Project date (YYYY-MM-DD) |
| `featured` | boolean | Whether to feature this project |
| `overview.challenge` | string | Problem statement |
| `overview.solution` | string | Solution approach |
| `overview.impact` | string | Results achieved |
| `tags` | array | List of relevant tags |
| `blogPosts` | array | Array of blog post objects |

## Blog Post Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique post identifier |
| `title` | string | Post display title |
| `slug` | string | URL-friendly identifier |
| `date` | string | Publication date (YYYY-MM-DD) |
| `excerpt` | string | Brief post summary |
| `readTime` | string | Estimated reading time |
| `content` | string | Path to markdown file |

## URL Structure

- Projects list: `/my-work.html`
- Project detail: `/project.html?slug=your-project-slug`
- Blog post: `/post.html?project=your-project-slug&post=your-post-slug`

## Styling

Blog posts use custom CSS defined in `post.html`:
- Poppins font for headings
- Larger font size (1.1rem) for readability
- Styled blockquotes with accent color
- Formatted links with border-bottom
- Responsive layout with max-width container

## Testing Your Changes

1. Start a local server (e.g., `python -m http.server`)
2. Navigate to `my-work.html`
3. Click on a project card
4. Verify project detail page loads
5. Click on a blog post card
6. Verify post content renders correctly

## Future Enhancements

Potential improvements:
- Full Markdown parser library (e.g., marked.js)
- Search functionality
- Category filtering
- Tags page
- RSS feed generation
- Reading progress indicator
- Social sharing buttons
- Related posts suggestions

## Troubleshooting

### Projects not loading
- Check browser console for errors
- Verify `data/projects.json` is valid JSON
- Ensure file paths are correct

### Blog posts not displaying
- Verify markdown file paths in projects.json
- Check that markdown files exist at specified paths
- Ensure file permissions allow reading

### Styling issues
- Clear browser cache
- Check that CSS files are loading
- Verify Bootstrap is properly included

## Questions?

For help or feature requests, contact Simon at [your contact method].
