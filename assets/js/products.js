// Product Case Study System - Redesign Refactor

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
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');

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
        try {
            console.log('Fetching products-list.json...');
            const response = await fetch('data/products-list.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const productFiles = await response.json();
            console.log('Product files:', productFiles);

            const products = await Promise.all(
                productFiles.map(async (filename) => {
                    console.log('Loading:', filename);
                    const markdown = await this.loadProductFile(filename);
                    const { metadata, content } = this.parseMarkdown(markdown);
                    console.log('Loaded product:', metadata.title);
                    return {
                        filename,
                        ...metadata,
                        content
                    };
                })
            );

            this.products = products.sort((a, b) => new Date(b.date) - new Date(a.date));
            console.log('Total products loaded:', this.products.length);
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
            month: 'long'
        });
    }

    // Calendar icon SVG
    getCalendarIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
    }

    // Arrow icon SVG
    getArrowIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;
    }

    // Render product card HTML
    renderProductCard(product) {
        const tags = Array.isArray(product.tags) ? product.tags : [];

        return `
            <a href="product.html?slug=${product.slug}" class="project-card">
                <div class="project-image-wrapper">
                    <img src="${product.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'}"
                         alt="${product.title}"
                         class="project-image">
                    <div class="project-overlay"></div>
                    <span class="project-category">${product.category || 'Product'}</span>
                    <div class="project-arrow">
                        ${this.getArrowIcon()}
                    </div>
                </div>
                <h3 class="project-title">${product.title}</h3>
                <p class="project-description">${product.description}</p>
                <div class="project-date">
                    ${this.getCalendarIcon()}
                    ${this.formatDate(product.date)}
                </div>
            </a>
        `;
    }

    // Render product cards on My Work page
    renderProductCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning" style="grid-column: 1 / -1;">
                    <p><strong>Unable to load products</strong></p>
                    <p>Please run a local web server to view products. Try: <code>python -m http.server 8000</code></p>
                </div>
            `;
            return;
        }

        this.products.forEach(product => {
            container.innerHTML += this.renderProductCard(product);
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

        // Update page title
        document.title = `${product.title} | Simon Tadeu`;

        container.innerHTML = `
            <nav class="breadcrumb">
                <a href="my-work.html">My Work</a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current">${product.title}</span>
            </nav>

            <article>
                <header class="product-header">
                    <div class="product-meta">
                        <span class="product-category-badge">${product.category || 'Product'}</span>
                        <span class="product-date">${this.formatDate(product.date)}</span>
                    </div>
                    <div class="product-tags">
                        ${tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                    </div>
                    ${product.thumbnail ? `<img src="${product.thumbnail}" class="product-thumbnail" alt="${product.title}">` : ''}
                </header>

                <div class="product-content">
                    ${htmlContent}
                </div>

                <footer class="product-footer">
                    <a href="my-work.html" class="btn btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back to My Work
                    </a>
                </footer>
            </article>
        `;
    }

    // Render featured products on home page (limit to 3 most recent)
    renderFeaturedProducts(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        const featuredProducts = this.products.slice(0, 3);

        if (featuredProducts.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--muted-foreground); grid-column: 1 / -1;">
                    No products available yet.
                </p>
            `;
            return;
        }

        featuredProducts.forEach(product => {
            container.innerHTML += this.renderProductCard(product);
        });
    }
}

// Initialize
const productSystem = new ProductSystem();

// Auto-load on page ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');

    await productSystem.loadProducts();

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    console.log('Current path:', path);
    console.log('Products loaded:', productSystem.products.length);

    if (path.includes('my-work')) {
        console.log('Rendering products cards...');
        productSystem.renderProductCards('products-container');
    } else if (path.includes('product')) {
        const slug = params.get('slug');
        if (slug) {
            console.log('Rendering product detail for:', slug);
            await productSystem.renderProduct(slug, 'product-detail');
        }
    } else if (path === '/' || path.includes('index') || path.endsWith('/')) {
        console.log('Rendering featured products on home page...');
        productSystem.renderFeaturedProducts('featured-products-container');
    }
});
