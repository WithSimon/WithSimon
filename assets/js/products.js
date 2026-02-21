// Product Case Study System - Redesign Refactor

function escapeHtml(str) {
    if (str == null) return '';
    const s = String(str);
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return s.replace(/[&<>"']/g, (c) => map[c]);
}

class ProductSystem {
    constructor() {
        this.products = [];
    }

    // Parse frontmatter and content from markdown
    parseMarkdown(markdown) {
        const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
        const match = markdown.match(frontmatterRegex);

        if (!match) {
            return { metadata: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = match[2];

        // Parse YAML-style frontmatter
        const metadata = {};
        frontmatter.split(/\r?\n/).forEach(line => {
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

        // Code blocks (must come before other replacements) - escape content to prevent XSS
        html = html.replace(/```([\s\S]*?)```/g, (_, code) => '<pre><code>' + escapeHtml(code) + '</code></pre>');

        // Headers
        html = html.replace(/^### (.*$)/gim, (_, t) => '<h3>' + escapeHtml(t) + '</h3>');
        html = html.replace(/^## (.*$)/gim, (_, t) => '<h2>' + escapeHtml(t) + '</h2>');
        html = html.replace(/^# (.*$)/gim, (_, t) => '<h1>' + escapeHtml(t) + '</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, (_, t) => '<strong>' + escapeHtml(t) + '</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, (_, t) => '<em>' + escapeHtml(t) + '</em>');

        // Links - escape text and URL for attribute safety
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => '<a href="' + escapeHtml(url) + '">' + escapeHtml(text) + '</a>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, (_, t) => '<blockquote>' + escapeHtml(t) + '</blockquote>');

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
                processedLines.push('<li>' + escapeHtml(unorderedMatch[1]) + '</li>');
            } else if (orderedMatch) {
                if (!inList || listType !== 'ol') {
                    if (inList) processedLines.push(`</${listType}>`);
                    processedLines.push('<ol>');
                    listType = 'ol';
                    inList = true;
                }
                processedLines.push('<li>' + escapeHtml(orderedMatch[1]) + '</li>');
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
            return '<p>' + escapeHtml(para) + '</p>';
        }).join('\n');

        return html;
    }

    // Load all products from the products directory
    async loadProducts() {
        try {
            const response = await fetch('data/products-list.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const productFiles = await response.json();
            const results = await Promise.allSettled(
                productFiles.map(async (filename) => {
                    const markdown = await this.loadProductFile(filename);
                    const { metadata, content } = this.parseMarkdown(markdown);
                    return { filename, ...metadata, content };
                })
            );
            const products = results
                .filter((r) => r.status === 'fulfilled')
                .map((r) => r.value);
            results.forEach((r, i) => {
                if (r.status === 'rejected') {
                    console.warn('Product load failed:', productFiles[i], r.reason);
                }
            });
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
            month: 'long'
        });
    }

    // Calendar icon SVG
    getCalendarIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
    }

    // Arrow icon SVG
    getArrowIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;
    }

    // Render product card HTML (all dynamic content escaped)
    renderProductCard(product) {
        const slug = encodeURIComponent(product.slug || '');
        const title = escapeHtml(product.title || '');
        const description = escapeHtml(product.description || '');
        const category = escapeHtml(product.category || 'Product');
        const thumb = product.thumbnail ? escapeHtml(product.thumbnail) : 'assets/img/placeholder-project.svg';

        return `
            <a href="product.html?slug=${slug}" class="project-card">
                <div class="project-image-wrapper">
                    <img src="${thumb}"
                         alt="${title}"
                         class="project-image">
                    <div class="project-overlay"></div>
                    <span class="project-category">${category}</span>
                    <div class="project-arrow">
                        ${this.getArrowIcon()}
                    </div>
                </div>
                <h3 class="project-title">${title}</h3>
                <p class="project-description">${description}</p>
                <div class="project-date">
                    ${this.getCalendarIcon()} ${this.formatDate(product.date)}
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

    // Parse markdown content into sections (split by ## headings)
    parseMarkdownSections(content) {
        const sections = [];
        const lines = content.split(/\r?\n/);
        let currentSection = null;

        // Section color mapping (cycles through colors)
        const sectionColors = ['info', 'main', 'secondary', 'accent'];
        const sectionIcons = {
            'context': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
            'problem': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
            'solution': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
            'execution': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            'results': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
            'takeaways': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
            'default': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'
        };

        lines.forEach(line => {
            // Check for ## header (section start)
            const headerMatch = line.match(/^## (.+)$/);
            if (headerMatch) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                const title = headerMatch[1].trim();
                const titleLower = title.toLowerCase();

                // Determine icon based on title
                let icon = sectionIcons.default;
                for (const [key, value] of Object.entries(sectionIcons)) {
                    if (titleLower.includes(key)) {
                        icon = value;
                        break;
                    }
                }

                currentSection = {
                    title: title,
                    icon: icon,
                    color: sectionColors[sections.length % sectionColors.length],
                    content: []
                };
            } else if (currentSection) {
                // Skip # heading (main title) and --- separators
                if (!line.match(/^# /) && !line.match(/^---$/)) {
                    currentSection.content.push(line);
                }
            }
        });

        // Don't forget the last section
        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    }

    // Render styled content with bullet points and subsections
    renderStyledContent(contentLines, color) {
        const lines = contentLines;
        let html = '';
        let inBulletList = false;
        let currentParagraph = [];

        const flushParagraph = () => {
            if (currentParagraph.length > 0) {
                const text = currentParagraph.join(' ').trim();
                if (text) {
                    html += '<p>' + escapeHtml(text) + '</p>';
                }
                currentParagraph = [];
            }
        };

        const closeBulletList = () => {
            if (inBulletList) {
                html += '</ul>';
                inBulletList = false;
            }
        };

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Skip empty lines between sections
            if (trimmedLine === '') {
                flushParagraph();
                closeBulletList();
                return;
            }

            // Check for subsection headers (lines ending with ":")
            if (trimmedLine.match(/^[A-Z][^-•\n]*:$/)) {
                flushParagraph();
                closeBulletList();
                html += `<div class="project-subsection-header">
                    <span class="bullet-bar color-${color}"></span>
                    ${escapeHtml(trimmedLine)}
                </div>`;
                return;
            }

            // Check for bullet points (- or •)
            if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                flushParagraph();
                if (!inBulletList) {
                    html += `<ul class="project-bullet-list">`;
                    inBulletList = true;
                }
                const bulletText = trimmedLine.replace(/^[-•]\s*/, '').trim();
                html += `<li>
                    <span class="bullet color-${color}"></span>
                    <span>${escapeHtml(bulletText)}</span>
                </li>`;
                return;
            }

            // Regular text - accumulate for paragraph
            closeBulletList();
            currentParagraph.push(trimmedLine);
        });

        // Flush any remaining content
        flushParagraph();
        closeBulletList();

        return html;
    }

    // Render individual product page with card-based sections
    async renderProduct(slug, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const product = this.getProductBySlug(slug);

        if (!product) {
            container.innerHTML = '<div class="alert alert-warning">Product not found.</div>';
            return;
        }

        const tags = Array.isArray(product.tags) ? product.tags : [];
        const sections = this.parseMarkdownSections(product.content);

        // Update page title (safe: product is from our data)
        document.title = (product.title || 'Product') + ' | Simon Tadeu';

        // Separate first section (full-width) from the rest (2-column grid)
        const [contextSection, ...otherSections] = sections;

        // Tag icon SVG
        const tagIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`;

        // Arrow left icon SVG
        const arrowLeftIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;

        // Calendar icon SVG
        const calendarIcon = this.getCalendarIcon();

        let html = `
            <!-- Back Navigation -->
            <section class="project-detail-hero section-padding">
                <div class="container">
                    <a href="my-work.html" class="back-link">
                        ${arrowLeftIcon}
                        Back to Projects
                    </a>

                    <!-- Meta Info -->
                    <div class="project-detail-meta">
                        <span class="project-detail-badge">${escapeHtml(product.category || 'Product')}</span>
                        <span class="project-detail-date">
                            ${calendarIcon} ${this.formatDate(product.date)}
                        </span>
                    </div>

                    <!-- Title -->
                    <h1 class="project-detail-title">${escapeHtml(product.title || '')}</h1>

                    <!-- Description -->
                    <p class="project-detail-description">${escapeHtml(product.description || '')}</p>

                    <!-- Tags -->
                    <div class="project-detail-tags">
                        ${tags.map(tag => `<span class="project-detail-tag">${tagIcon} ${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
            </section>

            <!-- Hero Image -->
            ${product.thumbnail ? `
            <section class="project-detail-image">
                <div class="container">
                    <div class="project-detail-image-wrapper">
                        <img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.title || '')}">
                        <div class="project-detail-image-overlay"></div>
                    </div>
                </div>
            </section>
            ` : ''}
        `;

        // Context Section - Full Width (if exists)
        if (contextSection) {
            html += `
            <section style="padding-top: 2rem; padding-bottom: 1.5rem;">
                <div class="container">
                    <div class="project-section-card full-width" style="border: 1px solid hsl(270, 70%, 65%, 0.4);">
                        <div class="project-section-header color-${contextSection.color}">
                            <div class="project-section-icon">${contextSection.icon}</div>
                            <h2 class="project-section-title">${escapeHtml(contextSection.title)}</h2>
                        </div>
                        <div class="project-section-content">
                            ${this.renderStyledContent(contextSection.content, contextSection.color)}
                        </div>
                    </div>
                </div>
            </section>
            `;
        }

        // Two-Column Grid for Remaining Sections
        if (otherSections.length > 0) {
            html += `
            <section style="padding-top: 0; padding-bottom: 0;">
                <div class="container">
                    <div class="project-sections-grid">
                        ${otherSections.map(section => {
                            const borderColor = section.color === 'info' ? 'hsl(270, 70%, 65%, 0.4)' :
                                               section.color === 'main' ? 'hsl(340, 85%, 65%, 0.4)' :
                                               section.color === 'secondary' ? 'hsl(25, 90%, 58%, 0.4)' :
                                               'hsl(45, 90%, 55%, 0.4)';
                            return `
                            <div class="project-section-card" style="border: 1px solid ${borderColor};">
                                <div class="project-section-header color-${section.color}">
                                    <div class="project-section-icon">${section.icon}</div>
                                    <h2 class="project-section-title">${escapeHtml(section.title)}</h2>
                                </div>
                                <div class="project-section-content">
                                    ${this.renderStyledContent(section.content, section.color)}
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
            `;
        }

        // Footer with back button
        html += `
            <section class="section-padding" style="padding-bottom: 4rem;">
                <div class="container">
                    <div class="product-footer">
                        <a href="my-work.html" class="btn btn-secondary">
                            ${arrowLeftIcon}
                            Back to My Work
                        </a>
                    </div>
                </div>
            </section>
        `;

        container.innerHTML = html;
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
    await productSystem.loadProducts();

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const baseSegment = path.split('/').filter(Boolean).pop() || '';
    const isHome = path === '/' || path.endsWith('/') || baseSegment === '' || baseSegment === 'index.html' || baseSegment.startsWith('index');

    if (path.includes('my-work')) {
        productSystem.renderProductCards('products-container');
    } else if (path.includes('product')) {
        const slug = params.get('slug');
        if (slug) {
            await productSystem.renderProduct(slug, 'product-detail');
        }
    } else if (isHome) {
        productSystem.renderFeaturedProducts('featured-products-container');
    }
});
