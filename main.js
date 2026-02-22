const DATA_URL = "data.json";
const SUPPORTED_LOCALES = ["en", "de"];
const DEFAULT_LOCALE = "en";
const THEME_KEY = "portfolio_theme";

const byId = (id) => document.getElementById(id);
const isSupportedLocale = (value) => SUPPORTED_LOCALES.includes(value);
const isSupportedTheme = (value) => value === "light" || value === "dark";

const renderList = (el, items) => {
  el.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
};

const renderSkills = (container, skills) => {
  container.innerHTML = "";
  // make the container focusable so hover/focus applies to the whole block
  container.tabIndex = 0;
  skills.forEach((skill) => {
    const span = document.createElement("span");
    span.className = "skill-badge";
    span.textContent = skill;
    container.appendChild(span);
  });
};

const renderLanguages = (container, languages) => {
  renderList(container, languages);
  // make the container focusable so hover/focus applies to the whole block
  container.tabIndex = 0;
};

const renderEducation = (container, education) => {
  container.innerHTML = "";
  education.forEach((item) => {
    const article = document.createElement("article");
    article.className = "role-card";

    const title = document.createElement("h3");
    title.textContent = item.institution;
    article.appendChild(title);

    const degree = document.createElement("p");
    degree.textContent = item.degree;
    article.appendChild(degree);

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${item.dates} · ${item.location}`;
    article.appendChild(meta);

    container.appendChild(article);
  });
};

const renderProjects = (container, projects) => {
  container.innerHTML = "";
  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "project";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const problem = document.createElement("p");
    problem.innerHTML = `<span class=\"label\">Problem:</span> ${project.problem}`;

    const solution = document.createElement("p");
    solution.innerHTML = `<span class=\"label\">Designed / Automated:</span> ${project.solution}`;

    const tech = document.createElement("p");
    tech.innerHTML = `<span class=\"label\">Technologies:</span> ${project.tech.join(", ")}.`;

    const result = document.createElement("p");
    result.innerHTML = `<span class=\"label\">Result:</span> ${project.result}`;

    article.appendChild(title);
    article.appendChild(problem);
    article.appendChild(solution);
    article.appendChild(tech);
    article.appendChild(result);
    container.appendChild(article);
  });
};

const renderExperience = (container, experience) => {
  container.innerHTML = "";
  experience.forEach((role) => {
    const article = document.createElement("article");
    article.className = "role-card";

    const title = document.createElement("h3");
    title.textContent = role.title;

    article.appendChild(title);

    if (role.dates || role.location) {
      const meta = document.createElement("p");
      meta.className = "meta";
      if (role.dates && role.location) {
        meta.textContent = `${role.dates} · ${role.location}`;
      } else {
        meta.textContent = role.dates || role.location;
      }
      article.appendChild(meta);
    }

    if (role.highlights && role.highlights.length) {
      const list = document.createElement("ul");
      renderList(list, role.highlights);
      article.appendChild(list);
    }

    container.appendChild(article);
  });
};

const renderLinks = (links, ui) => {
  const github = byId("contact-github");
  github.href = links.github;
  github.querySelector(".link-text").textContent = ui.github_label || "GitHub";

  const linkedin = byId("contact-linkedin");
  linkedin.href = links.linkedin;
  linkedin.querySelector(".link-text").textContent = ui.linkedin_label || "LinkedIn";

  const resume = byId("contact-resume");
  resume.href = "#";
  resume.querySelector(".link-text").textContent = ui.download_cv_label || "Download CV";
  resume.onclick = (event) => {
    event.preventDefault();
    window.print();
  };

  const email = byId("contact-email");
  email.href = `mailto:${links.email}`;
  email.querySelector(".link-text").textContent = links.email;
};

const renderLanguageButtons = (activeLocale) => {
  SUPPORTED_LOCALES.forEach((locale) => {
    const btn = byId(`lang-${locale}`);
    if (!btn) {
      return;
    }
    const isActive = activeLocale === locale;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
};

const getStoredLocale = () => {
  const savedLocale = window.localStorage.getItem("portfolio_locale");
  if (isSupportedLocale(savedLocale)) {
    return savedLocale;
  }
  return DEFAULT_LOCALE;
};

const getQueryLocale = () => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("lang");
  if (isSupportedLocale(value)) {
    return value;
  }
  return null;
};

const updateQueryLocale = (locale) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", locale);
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl !== currentUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
};

const getInitialLocale = () => getQueryLocale() || getStoredLocale() || DEFAULT_LOCALE;

const getStoredTheme = () => {
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (isSupportedTheme(savedTheme)) {
    return savedTheme;
  }
  return null;
};

const getInitialTheme = () => {
  const savedTheme = getStoredTheme();
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  const currentTheme = isSupportedTheme(theme) ? theme : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  const themeBtn = byId("theme-toggle");
  if (!themeBtn) {
    return;
  }

  const isDark = currentTheme === "dark";
  themeBtn.classList.toggle("is-active", isDark);
  themeBtn.setAttribute("aria-pressed", String(isDark));
  themeBtn.textContent = isDark ? "Light" : "Dark";
};

const bindThemeSwitcher = () => {
  const themeBtn = byId("theme-toggle");
  if (!themeBtn) {
    return;
  }

  themeBtn.onclick = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  };
};

const setLocale = (allData, locale) => {
  const localeData = allData.locales[locale] || allData.locales[DEFAULT_LOCALE];
  const ui = localeData.ui || {};

  document.documentElement.lang = locale;
  updateQueryLocale(locale);
  document.title = ui.page_title || document.title;

  const description = document.querySelector('meta[name="description"]');
  if (description && ui.page_description) {
    description.setAttribute("content", ui.page_description);
  }

  byId("intro-name").textContent = localeData.name;
  byId("intro-role").textContent = localeData.role;
  byId("intro-summary").textContent = localeData.summary;
  const metaParts = [localeData.location, localeData.experience_years].filter(Boolean);
  byId("intro-meta").textContent = metaParts.join(" · ");

  byId("skills-title").textContent = ui.skills_title || "Skills";
  byId("experience-title").textContent = ui.experience_title || "Experience";
  byId("education-title").textContent = ui.education_title || "Education";
  byId("languages-title").textContent = ui.languages_title || "Languages";

  renderSkills(byId("skills-container"), localeData.skills);
  renderExperience(byId("experience-container"), localeData.experience);
  renderEducation(byId("education-container"), localeData.education);
  renderLanguages(byId("languages-container"), localeData.languages);
  renderLinks(allData.links, ui);

  const now = new Date();
  byId("footer-year").textContent = String(now.getFullYear());
  byId("footer-name").textContent = localeData.name;
  byId("footer-location").textContent = localeData.location;

  renderLanguageButtons(locale);
};

const bindLanguageSwitcher = (allData) => {
  SUPPORTED_LOCALES.forEach((locale) => {
    const btn = byId(`lang-${locale}`);
    if (!btn) {
      return;
    }
    btn.onclick = () => {
      window.localStorage.setItem("portfolio_locale", locale);
      setLocale(allData, locale);
    };
  });
};

applyTheme(getInitialTheme());
bindThemeSwitcher();

fetch(DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}`);
    }
    return response.json();
  })
  .then((data) => {
    bindLanguageSwitcher(data);
    setLocale(data, getInitialLocale());
  })
  .catch((error) => {
    console.error(error);
  });
