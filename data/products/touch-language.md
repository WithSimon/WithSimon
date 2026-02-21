---
title: Touch Language
slug: touch-language
description: A feature for the Bond Touch app that let couples save touch patterns with meanings and colors, creating a unique language of their own.
thumbnail: assets/img/products/touch-language.jpg
category: Wearables
date: 2021-08-01T00:00:00.000Z
tags: [Wearables, Mobile App, Product Management, User Research, Emotional Technology]

---
# Touch Language

## Context
Bond Touch is a Lisbon-based emotional technology company that makes smart bracelets for long-distance couples. When one person taps their bracelet, their partner's lights up and vibrates the same pattern, no matter where they are in the world. The companion app supported the hardware with features like touch history, color customization, and Private Space, an encrypted chat for sharing messages and photos.

I was the Product Manager for Software, and I led Touch Language from research through delivery. My team was six people: two Android developers, two iOS developers, one UX researcher, and one designer. I conducted the research, led discovery and delivery, managed QA, resolved hardware dependencies with the firmware team, led user testing, and supported go-to-market.

---

## Problem
Bond Touch's app had primarily served as a companion to the hardware. A place to pair your bracelet, check battery status, and review touch history. Previous efforts to drive engagement within the app itself hadn't gained meaningful traction. The app wasn't yet a destination in its own right, and users weren't spending much time there beyond setup and maintenance.

Through a round of general user research sessions conducted roughly two months before development began, we uncovered a key insight: users were already assigning meanings to their touch patterns and writing them down in physical notebooks. Couples had organically built private codes. Three taps meant "I love you," a long hold meant "call me." But there was nothing in the product to support or enhance this behavior. The richest part of how people used Bond Touch was completely invisible to us, living in notebooks and shared notes apps instead of our own platform.

---

## Solution
Touch Language gave users the ability to save touch patterns, assign them names and meanings, and apply custom colors, all managed within a new section of the app called the Touch Library. When a saved pattern was sent, the app would automatically match it and display the assigned meaning to the receiving partner, effectively translating touches in real time.

Key decisions included:
- Scoping a strict MVP that could ship in three months, deliberately mid-effort to high-results, given internal skepticism after previous engagement features underperformed
- Building a technical viability prototype early with the CTO: a click-based pattern matcher that didn't require the bracelet at all, just a button on screen to create and replicate patterns with real-time match accuracy feedback
- Leveraging Bond Touch v2's improved firmware and LED gradient capabilities to enable color customization tied to saved meanings, configuring the firmware to go beyond standard touch messaging
- Designing a clean UI that captured full touch messages on screen, mapping tap sequences to duration while handling edge cases for patterns that were too short or too long

---

## Execution
Development ran from roughly May to August 2021, with constant internal releases to test and readjust scope. The technical viability prototype the CTO and I built early on served double duty. It validated that pattern matching could work reliably, and it became a powerful buy-in tool. We had everyone in the office testing the prototype, trying to replicate patterns and watching match results in real time. It got people excited about the feature before a single line of production code was written.

The buy-in challenge was real. Touch Language didn't directly leverage a subscription service or promise an immediate fix to user retention, which was a known problem at the time. That made it a harder sell internally compared to initiatives with more obvious revenue or retention mechanics. The strict MVP scope was intentional. We needed to prove the concept quickly without overcommitting resources. On the technical side, the firmware work required configuring Bond Touch v2's hardware to support gradient LED colors tied to specific meanings, adding a visual layer on top of the standard vibration messaging. The UI work focused on representing touch patterns visually in a way that was intuitive. Users needed to look at a saved pattern and immediately associate it with the physical gesture, regardless of message length.

---

## Results & Takeaways
Within three weeks of release, 25% of all touches sent included an attributed meaning. Daily touches sent increased from ~275k to ~350k, a 27% jump, and touches per active user rose from 7.5 to 9, a 20% increase, all within the first month. Touch Language also contributed to a marginal improvement in user retention. The feature continued to evolve post-launch, with subsequent updates adding color gradients to meanings and new ways to manage the Touch Library. Crucially, Touch Language's success validated that touch-as-communication was Bond Touch's core differentiator, directly influencing the decision to develop Bond Touch More and its multidimensional touch capabilities.

Key takeaways:
- Technical viability prototypes are worth their weight in gold. Ours validated feasibility, generated internal excitement, and secured buy-in before production development even started
- Sometimes there's a goldmine insight hiding in existing user behavior that can anchor an entire feature. In this case, users journaling touch meanings in notebooks gave us everything we needed for a focused MVP
- Strict MVP scoping after a previous feature underperformed was the right call. Shipping quickly with a focused scope let results speak louder than projections
