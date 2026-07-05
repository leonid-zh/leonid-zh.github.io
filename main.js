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
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill;
    container.appendChild(li);
  });
};

const renderLanguages = (container, languages) => {
  renderList(container, languages);
};

const renderEducation = (container, education) => {
  container.innerHTML = "";
  education.forEach((item) => {
    const article = document.createElement("article");
    article.className = "role-card";

    const body = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = item.institution;
    body.appendChild(title);

    const degree = document.createElement("p");
    degree.textContent = item.degree;
    body.appendChild(degree);

    if (item.location) {
      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = item.location;
      body.appendChild(meta);
    }

    const date = document.createElement("div");
    date.className = "role-date";
    date.textContent = item.dates;

    article.appendChild(body);
    article.appendChild(date);

    container.appendChild(article);
  });
};

const renderSideProjects = (container, projects) => {
  container.innerHTML = "";
  if (!projects || projects.length === 0) {
    return;
  }

  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "showcase-item";

    const title = document.createElement("h3");
    if (project.url) {
      const link = document.createElement("a");
      link.href = project.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = project.title;
      title.appendChild(link);
    } else {
      title.textContent = project.title;
    }

    const description = document.createElement("p");
    description.textContent = project.description || "";

    article.appendChild(title);
    article.appendChild(description);
    container.appendChild(article);
  });
};

const renderExperience = (container, experience) => {
  container.innerHTML = "";
  experience.forEach((role) => {
    const article = document.createElement("article");
    article.className = "role-card";

    const body = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = role.title;
    body.appendChild(title);

    if (role.location) {
      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = role.location;
      body.appendChild(meta);
    }

    if (role.highlights && role.highlights.length) {
      const list = document.createElement("ul");
      renderList(list, role.highlights);
      body.appendChild(list);
    }

    const date = document.createElement("div");
    date.className = "role-date";
    date.textContent = role.dates || "";

    article.appendChild(body);
    article.appendChild(date);

    container.appendChild(article);
  });
};

const setOptionalLink = (link, url) => {
  if (!link) {
    return;
  }
  const hasUrl = Boolean(url);
  link.hidden = !hasUrl;
  link.closest("li").hidden = !hasUrl;
  if (hasUrl) {
    link.href = url;
  }
};

const createContactItem = (label, href, iconClass, external = true) => {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = href;
  if (external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  const icon = document.createElement("span");
  icon.className = `icon ${iconClass}`;
  icon.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.textContent = label;

  link.appendChild(icon);
  link.appendChild(text);
  li.appendChild(link);
  return li;
};

const renderContactList = (links, ui) => {
  const container = byId("contact-list");
  if (!container) {
    return;
  }

  container.innerHTML = "";
  if (links.email) {
    container.appendChild(createContactItem(links.email, `mailto:${links.email}`, "icon-email", false));
  }
  if (links.linkedin) {
    container.appendChild(createContactItem(ui.linkedin_label || "LinkedIn", links.linkedin, "icon-linkedin"));
  }
  if (links.github) {
    container.appendChild(createContactItem(ui.github_label || "GitHub", links.github, "icon-github"));
  }
  if (links.facebook) {
    container.appendChild(createContactItem(ui.facebook_label || "Facebook", links.facebook, "icon-facebook"));
  }
};

const renderLinks = (links, ui) => {
  const github = byId("contact-github");
  setOptionalLink(github, links.github);
  github.querySelector(".link-text").textContent = ui.github_label || "GitHub";

  const linkedin = byId("contact-linkedin");
  setOptionalLink(linkedin, links.linkedin);
  linkedin.querySelector(".link-text").textContent = ui.linkedin_label || "LinkedIn";

  const facebook = byId("contact-facebook");
  setOptionalLink(facebook, links.facebook);
  facebook.querySelector(".link-text").textContent = ui.facebook_label || "Facebook";

  const resume = byId("contact-resume");
  resume.href = "#";
  resume.querySelector(".link-text").textContent = ui.download_cv_label || "Download CV";
  resume.onclick = (event) => {
    event.preventDefault();
    window.print();
  };

  const email = byId("contact-email");
  setOptionalLink(email, links.email ? `mailto:${links.email}` : "");
  email.querySelector(".link-text").textContent = links.email;

  renderContactList(links, ui);
};

const getInitials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const renderAvatar = (imageUrl, name) => {
  const avatar = byId("nav-avatar");
  const initials = getInitials(name);

  avatar.innerHTML = "";
  avatar.textContent = initials;
  avatar.classList.remove("has-image");

  if (!imageUrl) {
    return;
  }

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = name;
  image.loading = "eager";
  image.decoding = "async";
  image.onload = () => {
    avatar.innerHTML = "";
    avatar.appendChild(image);
    avatar.classList.add("has-image");
  };
  image.onerror = () => {
    avatar.innerHTML = "";
    avatar.textContent = initials;
    avatar.classList.remove("has-image");
  };
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
  byId("nav-name").textContent = localeData.name;
  renderAvatar(allData.profile_image, localeData.name);

  byId("skills-title").textContent = ui.skills_title || "Skills";
  byId("side-projects-title").textContent = ui.side_projects_title || "Side Projects";
  byId("experience-title").textContent = ui.experience_title || "Experience";
  byId("education-title").textContent = ui.education_title || "Education";
  byId("languages-title").textContent = ui.languages_title || "Languages";
  byId("contact-title").textContent = ui.contact_title || "Contact";
  byId("contact-note").textContent = ui.contact_note || "";
  byId("nav-about").textContent = ui.about_title || "About";
  byId("nav-experience").textContent = ui.experience_nav || ui.experience_title || "Experience";
  byId("nav-education").textContent = ui.education_title || "Education";
  byId("nav-skills").textContent = ui.skills_title || "Skills";
  byId("nav-side-projects").textContent = ui.side_projects_title || "Side Projects";
  byId("nav-languages").textContent = ui.languages_title || "Languages";
  byId("nav-contact").textContent = ui.contact_title || "Contact";

  renderSkills(byId("skills-container"), localeData.skills);
  renderSideProjects(byId("side-projects-container"), localeData.side_projects);
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
