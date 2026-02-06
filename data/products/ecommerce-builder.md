---
title: E-commerce Builder
slug: ecommerce-builder
description: A no-code e-commerce platform with native marketing automation, built for merchants who need completeness without complexity.
thumbnail: assets/img/products/ecommerce.jpeg
category: E-Commerce
date: 2024-02-01T00:00:00.000Z
tags: [SaaS, No-Code, E-commerce, Product Management, Marketing Automation]
---

# E-commerce Builder

## Context
Krepling is an e-commerce platform designed to give small-to-midsize merchants a complete, native toolkit without the fragility of plugin-dependent architectures. As Senior Product Manager at Altar.io, I led the development of two core features: the no-code storefront builder and the marketing automation system.

The team included a project manager, designer, engineering manager, backend developer, frontend developer, and full-stack engineer, all based in Lisbon. It was a complex build for the agency's typical MVP scope, but the team brought deep heuristic product experience and worked in close collaboration with the founders as if we held equity in their success.

## Problem
Existing e-commerce platforms market their plugin ecosystems as strengths, but this creates long-term fragility. Merchants stitch together ten different addons to run their business; when one fails, the chain collapses. The result is wasted time troubleshooting, compounded subscription costs, and operational downtime.

For storefronts, the gap was equally clear: template-based builders force merchants into rigid, cookie-cutter designs. Customization either requires hiring developers or accepting a site that looks identical to thousands of others. Single-store owners needed sophisticated brand expression without the overhead of permanent technical staff.

## Solution
Krepling was built on an "Apple, not Microsoft" philosophy: maximum capability within foolproof UX, designed for the 90% of use cases that matter most while intentionally avoiding the edge-case 10% that breeds bloat and confusion.

Key decisions included:
- A section-based storefront system with purpose-built components (hero, product grids, category lists) that allow deep brand customization through design tokens and configurable variables
- A marketing automation builder structured around three dimensions: When (trigger), Who (segmentation), and What (action), using a linguistic query builder that ensures every combination makes semantic sense
- Native functionality covering abandoned cart recovery, post-purchase flows, and lifecycle marketing without external dependencies
- Prioritizing ease-of-use over raw power, trusting that well-designed constraints prevent user error better than unlimited freedom

## Execution
Work began in July 2023 on both features simultaneously. The storefront started with design system fundamentals, defining tokens, variable inheritance, and layer architecture, before building the editor interface. The automation system was constructed iteratively around use cases, from basic MVP triggers to complex multi-step workflows.

I drew heavily on prior e-commerce experience to define the 90% use-case boundary heuristically, validating through internal testing and developer collaboration rather than extensive external research. The team navigated the grey areas of "sufficiently simple" through repeated prototyping until the balance felt inevitable rather than compromised.

Technical challenges centered on automation performance at scale, supporting multiple stores per user, locales, currencies, and timezones while maintaining real-time responsiveness. We architected around Kafka for event streaming and invested heavily in mapping decision trees to eliminate linguistic impossibilities in the query builder.

Founder collaboration happened through periodic office visits and pre-release walkthroughs. Day-to-day, I ran sprints with engineers and pulled designers in as needed, testing features internally against real merchant scenarios before handoff.

## Results & Takeaways
Krepling secured $4.3M in pre-seed funding from Jason Calacanis' Launch accelerator and onboarded 500+ customers. The founders embraced the opinionated product vision and became one of the agency's most satisfied partnerships.

Key takeaways:
- Striving for simplicity often requires more complex underlying architecture than building for flexibility; the constraint is the feature
- Opinionated products demand experienced teams; the responsibility of choosing for users only works when you've lived their problems
- Agency environments benefit from more user-facing validation than timeline pressures typically allow
- Prior e-commerce operational experience accelerates product decisions but can't replace fresh merchant perspectives

The project remains ongoing at Altar.io.

