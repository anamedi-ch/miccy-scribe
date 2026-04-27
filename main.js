(function () {
  "use strict";
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("motion-ok");
  }
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (nav && toggle) {
    const links = nav.querySelectorAll("a");
    function setOpen(isOpen) {
      nav.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    }
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 880px)").matches) {
          setOpen(false);
        }
      });
    });
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });
  }
  if (header) {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          header.classList.toggle("is-scrolled", window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (document.documentElement.classList.contains("motion-ok")) {
    const revealEls = document.querySelectorAll(
      "main > section.section:not(.hero), .site-footer"
    );
    function revealAll() {
      revealEls.forEach(function (el) {
        el.classList.add("is-revealed");
      });
    }
    if (revealEls.length > 0) {
      if (!("IntersectionObserver" in window)) {
        revealAll();
      } else {
        const io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                io.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        revealEls.forEach(function (el) {
          io.observe(el);
        });
      }
    }
  }
})();

(function () {
  "use strict";
  const githubLinks = document.querySelectorAll("a.miccy-github-source");
  githubLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      var posthog = window.posthog;
      if (posthog && typeof posthog.capture === "function") {
        try {
          posthog.capture("github_source_link_clicked", { page: window.location.pathname });
        } catch (_err) {
          /* ignore */
        }
      }
    });
  });
})();

/**
 * Optional download click reporting for platform buttons (see download page).
 * Enable one or more backends:
 * - PostHog: snippet in <head>; fires posthog.capture("download_clicked", { platform, ... }).
 * - Plausible: load their script; fires plausible("Download", { props: { platform } }).
 * - Google Analytics: if window.gtag exists, fires file_download with platform.
 * - Custom URL: add <meta name="miccy-download-tracker" content="https://your-endpoint" />.
 *   Sends POST application/x-www-form-urlencoded: platform, page, t, target (href).
 */
(function () {
  "use strict";
  const meta = document.querySelector('meta[name="miccy-download-tracker"]');
  const raw = meta ? meta.getAttribute("content") : "";
  const trackerUrl =
    raw && raw.trim() && /^https?:\/\//i.test(raw.trim()) ? raw.trim() : "";
  function executeReportDownload(platform, href) {
    if (trackerUrl && typeof navigator.sendBeacon === "function") {
      const params = new URLSearchParams();
      params.set("platform", platform);
      params.set("page", window.location.pathname);
      params.set("t", String(Date.now()));
      if (href && href !== "#") {
        params.set("target", href);
      }
      try {
        navigator.sendBeacon(trackerUrl, params);
      } catch (_err) {
        /* ignore */
      }
    }
    if (typeof window.plausible === "function") {
      try {
        window.plausible("Download", { props: { platform: platform } });
      } catch (_err) {
        /* ignore */
      }
    }
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", "file_download", {
          platform: platform,
          event_category: "download",
          transport_type: "beacon",
        });
      } catch (_err) {
        /* ignore */
      }
    }
    const posthog = window.posthog;
    if (posthog && typeof posthog.capture === "function") {
      try {
        const props = { platform: platform };
        if (href && href !== "#") {
          props.download_target = href;
        }
        posthog.capture("download_clicked", props);
      } catch (_err) {
        /* ignore */
      }
    }
  }
  const downloadAnchors = document.querySelectorAll("a.btn--download[data-platform]");
  downloadAnchors.forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      const platform = anchor.getAttribute("data-platform") || "unknown";
      const href = anchor.getAttribute("href") || "";
      executeReportDownload(platform, href);
    });
  });
})();

(function () {
  "use strict";
  var posthog = window.posthog;

  // Track hero and page-level CTA download button clicks
  var ctaLinks = document.querySelectorAll(
    "a.btn--primary[href]:not([data-platform])"
  );
  ctaLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (posthog && typeof posthog.capture === "function") {
        try {
          posthog.capture("cta_clicked", {
            label: link.textContent.trim(),
            href: link.getAttribute("href"),
            page: window.location.pathname
          });
        } catch (_err) {
          /* ignore */
        }
      }
    });
  });

  // Track FAQ item expansions
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (details.open && posthog && typeof posthog.capture === "function") {
        var summary = details.querySelector(".faq__summary");
        try {
          posthog.capture("faq_item_expanded", {
            question: summary ? summary.textContent.trim() : "",
            page: window.location.pathname
          });
        } catch (_err) {
          /* ignore */
        }
      }
    });
  });
})();
