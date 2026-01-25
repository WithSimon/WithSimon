// Blog System - Load and display projects and blog posts

class BlogSystem {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.currentPost = null;
    }

    // Load projects data
    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            this.projects = await response.json();
            return this.projects;
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    // Get a single project by slug
    getProjectBySlug(slug) {
        return this.projects.find(project => project.slug === slug);
    }

    // Get a blog post from a project
    getPostFromProject(projectSlug, postSlug) {
        const project = this.getProjectBySlug(projectSlug);
        if (!project) return null;

        return project.blogPosts.find(post => post.slug === postSlug);
    }

    // Load markdown content for a blog post
    async loadPostContent(contentPath) {
        try {
            const response = await fetch(contentPath);
            const markdown = await response.text();
            return this.parseMarkdown(markdown);
        } catch (error) {
            console.error('Error loading post content:', error);
            return '';
        }
    }

    // Basic markdown to HTML parser
    parseMarkdown(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote class="blockquote">$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');

        // Lists (unordered)
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-unstyled">$1</ul>');

        // Lists (ordered)
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

        // Paragraphs
        html = html.split('\n\n').map(para => {
            if (!para.match(/^<(h|ul|ol|blockquote|hr|li)/)) {
                return `<p>${para}</p>`;
            }
            return para;
        }).join('\n');

        return html;
    }

    // Render project cards for "My Work" page
    renderProjectCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        this.projects.forEach(project => {
            const card = this.createProjectCard(project);
            container.appendChild(card);
        });
    }

    // Create a single project card element
    createProjectCard(project) {
        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="project-card h-100">
                <a href="project.html?slug=${project.slug}" class="text-decoration-none text-dark">
                    <img class="rounded img-fluid d-block w-100 fit-cover"
                         style="height: 200px; object-fit: cover;"
                         src="${project.thumbnail}"
                         alt="${project.title}">
                    <div class="py-4">
                        <span class="badge bg-primary mb-2">${project.category}</span>
                        <h4>${project.title}</h4>
                        <p class="text-muted">${project.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted">${this.formatDate(project.date)}</small>
                            <span class="badge bg-secondary">${project.blogPosts.length} posts</span>
                        </div>
                    </div>
                </a>
            </div>
        `;

        return col;
    }

    // Format date to readable string
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Render project detail page
    async renderProjectDetail(projectSlug, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const project = this.getProjectBySlug(projectSlug);
        if (!project) {
            container.innerHTML = '<div class="alert alert-warning">Project not found.</div>';
            return;
        }

        this.currentProject = project;

        container.innerHTML = `
            <div class="row mb-5">
                <div class="col-12">
                    <img src="${project.thumbnail}" class="img-fluid rounded mb-4" alt="${project.title}">
                    <h1 class="mb-3" style="font-family: 'Poppins', sans-serif;">${project.title}</h1>
                    <p class="lead">${project.description}</p>
                    <div class="mb-4">
                        ${project.tags.map(tag => `<span class="badge bg-info me-2">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-4">
                    <h4>Challenge</h4>
                    <p>${project.overview.challenge}</p>
                </div>
                <div class="col-md-4">
                    <h4>Solution</h4>
                    <p>${project.overview.solution}</p>
                </div>
                <div class="col-md-4">
                    <h4>Impact</h4>
                    <p>${project.overview.impact}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <h2 class="mb-4">Case Study Series</h2>
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        ${project.blogPosts.map(post => this.createPostCardHTML(post, projectSlug)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Create blog post card HTML
    createPostCardHTML(post, projectSlug) {
        return `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text text-muted">${post.excerpt}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${this.formatDate(post.date)}</small>
                            <small class="text-muted">${post.readTime}</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="post.html?project=${projectSlug}&post=${post.slug}" class="btn btn-primary btn-sm">Read Post</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render individual blog post
    async renderBlogPost(projectSlug, postSlug, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const project = this.getProjectBySlug(projectSlug);
        const post = this.getPostFromProject(projectSlug, postSlug);

        if (!project || !post) {
            container.innerHTML = '<div class="alert alert-warning">Post not found.</div>';
            return;
        }

        this.currentPost = post;

        // Load and render the markdown content
        const content = await this.loadPostContent(post.content);

        container.innerHTML = `
            <div class="row mb-4">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="my-work.html">My Work</a></li>
                            <li class="breadcrumb-item"><a href="project.html?slug=${projectSlug}">${project.title}</a></li>
                            <li class="breadcrumb-item active" aria-current="page">${post.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <article class="row">
                <div class="col-lg-8 mx-auto">
                    <header class="mb-5">
                        <h1 class="mb-3" style="font-family: 'Poppins', sans-serif;">${post.title}</h1>
                        <div class="d-flex justify-content-between text-muted mb-4">
                            <span>${this.formatDate(post.date)}</span>
                            <span>${post.readTime}</span>
                        </div>
                    </header>

                    <div class="blog-content">
                        ${content}
                    </div>

                    <footer class="mt-5 pt-4 border-top">
                        <a href="project.html?slug=${projectSlug}" class="btn btn-outline-primary">← Back to Project</a>
                    </footer>
                </div>
            </article>
        `;
    }
}

// Initialize the blog system
const blogSystem = new BlogSystem();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await blogSystem.loadProjects();

    // Check which page we're on and render accordingly
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('my-work.html')) {
        blogSystem.renderProjectCards('projects-container');
    } else if (path.includes('project.html')) {
        const slug = params.get('slug');
        if (slug) {
            await blogSystem.renderProjectDetail(slug, 'project-detail');
        }
    } else if (path.includes('post.html')) {
        const projectSlug = params.get('project');
        const postSlug = params.get('post');
        if (projectSlug && postSlug) {
            await blogSystem.renderBlogPost(projectSlug, postSlug, 'blog-post');
        }
    }
});
