// Simple product case study system

class ProductSystem {
    constructor() {
        this.products = [];
    }

    // Parse frontmatter and content from markdown
    parseMarkdown(markdown) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontmatterRegex);

        if (!match) {
            return { metadata: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = match[2];

        // Parse YAML-style frontmatter
        const metadata = {};
        frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                let value = valueParts.join(':').trim();

                // Handle arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(v => v.trim());
                }

                metadata[key.trim()] = value;
            }
        });

        return { metadata, content };
    }

    // Convert markdown to HTML
    markdownToHtml(markdown) {
        let html = markdown;

        // Code blocks (must come before other replacements)
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

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
        html = html.replace(/^> (.*$)/gim, '<blockquote class="blockquote border-start border-4 border-primary ps-3 my-3">$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr class="my-4">');

        // Lists
        const lines = html.split('\n');
        let inList = false;
        let listType = null;
        const processedLines = [];

        lines.forEach(line => {
            const unorderedMatch = line.match(/^[\-\*] (.*)$/);
            const orderedMatch = line.match(/^\d+\. (.*)$/);

            if (unorderedMatch) {
                if (!inList || listType !== 'ul') {
                    if (inList) processedLines.push(`</${listType}>`);
                    processedLines.push('<ul>');
                    listType = 'ul';
                    inList = true;
                }
                processedLines.push(`<li>${unorderedMatch[1]}</li>`);
            } else if (orderedMatch) {
                if (!inList || listType !== 'ol') {
                    if (inList) processedLines.push(`</${listType}>`);
                    processedLines.push('<ol>');
                    listType = 'ol';
                    inList = true;
                }
                processedLines.push(`<li>${orderedMatch[1]}</li>`);
            } else {
                if (inList) {
                    processedLines.push(`</${listType}>`);
                    inList = false;
                    listType = null;
                }
                processedLines.push(line);
            }
        });

        if (inList) {
            processedLines.push(`</${listType}>`);
        }

        html = processedLines.join('\n');

        // Paragraphs
        html = html.split('\n\n').map(para => {
            para = para.trim();
            if (!para) return '';
            if (para.match(/^<(h|ul|ol|blockquote|hr|pre|li)/)) {
                return para;
            }
            return `<p>${para}</p>`;
        }).join('\n');

        return html;
    }

    // Load all products from the products directory
    async loadProducts() {
        // In a real implementation, you'd need a manifest file or server-side directory listing
        // For now, we'll use a simple products list file
        try {
            const response = await fetch('data/products-list.json');
            const productFiles = await response.json();

            const products = await Promise.all(
                productFiles.map(async (filename) => {
                    const markdown = await this.loadProductFile(filename);
                    const { metadata, content } = this.parseMarkdown(markdown);
                    return {
                        filename,
                        ...metadata,
                        content
                    };
                })
            );

            this.products = products.sort((a, b) => new Date(b.date) - new Date(a.date));
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    // Load a single product markdown file
    async loadProductFile(filename) {
        const response = await fetch(`data/products/${filename}`);
        return await response.text();
    }

    // Get product by slug
    getProductBySlug(slug) {
        return this.products.find(p => p.slug === slug);
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Render product cards on My Work page
    renderProductCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-warning" role="alert">
                        <h5>Unable to load products</h5>
                        <p class="mb-0">Please run a local web server to view products. Try: <code>python -m http.server 8000</code></p>
                    </div>
                </div>
            `;
            return;
        }

        this.products.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col';

            const tags = Array.isArray(product.tags) ? product.tags : [];

            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img class="card-img-top"
                         style="height: 200px; object-fit: cover;"
                         src="${product.thumbnail || 'https://via.placeholder.com/800x600?text=Product'}"
                         alt="${product.title}">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${product.category || 'Product'}</span>
                        <h4 class="card-title">${product.title}</h4>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="mt-3">
                            ${tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${this.formatDate(product.date)}</small>
                            <a href="product.html?slug=${product.slug}" class="btn btn-primary btn-sm">View Case Study</a>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(col);
        });
    }

    // Render individual product page
    async renderProduct(slug, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const product = this.getProductBySlug(slug);

        if (!product) {
            container.innerHTML = '<div class="alert alert-warning">Product not found.</div>';
            return;
        }

        const htmlContent = this.markdownToHtml(product.content);
        const tags = Array.isArray(product.tags) ? product.tags : [];

        container.innerHTML = `
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="my-work.html">My Work</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${product.title}</li>
                </ol>
            </nav>

            <article>
                <header class="mb-5">
                    <span class="badge bg-primary mb-2">${product.category || 'Product'}</span>
                    <p class="text-muted mb-3">${this.formatDate(product.date)}</p>
                    <div class="mb-3">
                        ${tags.map(tag => `<span class="badge bg-secondary me-2">${tag}</span>`).join('')}
                    </div>
                    ${product.thumbnail ? `<img src="${product.thumbnail}" class="img-fluid rounded mb-4" alt="${product.title}">` : ''}
                </header>

                <div class="product-content">
                    ${htmlContent}
                </div>

                <footer class="mt-5 pt-4 border-top">
                    <a href="my-work.html" class="btn btn-outline-primary">← Back to My Work</a>
                </footer>
            </article>
        `;
    }
}

// Initialize
const productSystem = new ProductSystem();

// Auto-load on page ready
document.addEventListener('DOMContentLoaded', async () => {
    await productSystem.loadProducts();

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('my-work.html')) {
        productSystem.renderProductCards('products-container');
    } else if (path.includes('product.html')) {
        const slug = params.get('slug');
        if (slug) {
            await productSystem.renderProduct(slug, 'product-detail');
        }
    }
});
