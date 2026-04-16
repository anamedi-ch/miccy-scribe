<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Miccy landing page. The PostHog web snippet was added to all five HTML pages (`index.html`, `download/index.html`, `privacy/index.html`, `impressum/index.html`, `models-guide/index.html`). Four custom events were instrumented in `main.js` alongside the existing `download_clicked` tracking that was already present. Environment variables were written to `.env` for documentation purposes.

| Event | Description | File |
|---|---|---|
| `download_clicked` | User clicks a platform-specific download button (macOS/Windows/Linux) — already existed | `main.js` |
| `cta_clicked` | User clicks a hero or page-level CTA button (e.g. "Download Now", "Download for macOS / Windows / Linux") | `main.js` |
| `faq_item_expanded` | User expands an FAQ accordion item; includes `question` property | `main.js` |
| `github_source_link_clicked` | User clicks the "Source code / GitHub" footer link | `main.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/160172/dashboard/624932
- **Download clicks over time** (line chart, 30d): https://eu.posthog.com/project/160172/insights/bE0AVCPA
- **Downloads by platform** (bar chart, 30d): https://eu.posthog.com/project/160172/insights/4iN7HWCI
- **Download conversion funnel** (pageview → CTA clicked → download clicked): https://eu.posthog.com/project/160172/insights/LaLt16Yx
- **Top FAQ questions expanded** (table, 30d): https://eu.posthog.com/project/160172/insights/4OJ8xBVo
- **GitHub source link clicks** (line chart, 30d): https://eu.posthog.com/project/160172/insights/JNNeXmNv

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
