console.log("JavaScript connected");
const themeButton = document.getElementById("themeToggle");
if (themeButton) {
  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeButton.textContent = "Switch to Light Mode";
    } else {
      themeButton.textContent = "Switch to Dark Mode";
    }
  });
}
(function () {
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (!("IntersectionObserver" in window) || sections.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          const active = link.getAttribute("href") === "#" + id;
          link.classList.toggle("is-active", active);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();

(function () {
  const searchInput = document.getElementById("project-search");
  const buttonHost = document.getElementById("project-tech-buttons");
  const statusEl = document.getElementById("project-results-status");
  const projects = Array.prototype.slice.call(
    document.querySelectorAll(".project-list li")
  );

  if (!searchInput || !buttonHost || projects.length === 0) {
    return;
  }

  function techsFor(item) {
    return (item.getAttribute("data-tech") || "")
      .split(",")
      .map(function (tech) {
        return tech.trim();
      })
      .filter(Boolean);
  }

  const technologies = [];
  projects.forEach(function (item) {
    techsFor(item).forEach(function (tech) {
      if (technologies.indexOf(tech) === -1) {
        technologies.push(tech);
      }
    });
  });

  let activeTech = "all";

  function makeButton(label, value) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("data-tech", value);
    button.setAttribute("aria-pressed", value === "all" ? "true" : "false");
    return button;
  }

  buttonHost.appendChild(makeButton("All", "all"));
  technologies.forEach(function (tech) {
    buttonHost.appendChild(makeButton(tech, tech));
  });

  function matchesSearch(item, query) {
    if (!query) {
      return true;
    }

    const name = (item.getAttribute("data-name") || "").toLowerCase();
    const tech = (item.getAttribute("data-tech") || "").toLowerCase();
    const text = (item.textContent || "").toLowerCase();
    return (
      name.indexOf(query) !== -1 ||
      tech.indexOf(query) !== -1 ||
      text.indexOf(query) !== -1
    );
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    projects.forEach(function (item) {
      const techMatch =
        activeTech === "all" || techsFor(item).indexOf(activeTech) !== -1;
      const show = techMatch && matchesSearch(item, query);
      item.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    buttonHost.querySelectorAll("button").forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute("data-tech") === activeTech ? "true" : "false"
      );
    });

    if (statusEl) {
      if (visible === 0) {
        statusEl.textContent = "No projects match that name or technology.";
      } else if (query || activeTech !== "all") {
        statusEl.textContent =
          visible + (visible === 1 ? " project" : " projects") + " shown.";
      } else {
        statusEl.textContent = "";
      }
    }
  }

  searchInput.addEventListener("input", applyFilters);

  buttonHost.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-tech]");
    if (!button) {
      return;
    }
    activeTech = button.getAttribute("data-tech") || "all";
    applyFilters();
  });
})();
