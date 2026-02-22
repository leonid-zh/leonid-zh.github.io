const DATA_URL = "data.json";

const byId = (id) => document.getElementById(id);

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

const renderLinks = (links) => {
  const github = byId("contact-github");
  github.href = links.github;
  github.querySelector(".link-text").textContent = "GitHub";

  const linkedin = byId("contact-linkedin");
  linkedin.href = links.linkedin;
  linkedin.querySelector(".link-text").textContent = "LinkedIn";

  const resume = byId("contact-resume");
  resume.href = "#";
  resume.querySelector(".link-text").textContent = "Download CV (PDF, A4)";
  resume.onclick = (event) => {
    event.preventDefault();
    window.print();
  };

  const email = byId("contact-email");
  email.href = `mailto:${links.email}`;
  email.querySelector(".link-text").textContent = links.email;
};

const render = (data) => {
  byId("intro-name").textContent = data.name;
  byId("intro-role").textContent = data.role;
  byId("intro-summary").textContent = data.summary;
  byId("intro-meta").textContent = `${data.location} · ${data.experience_years}`;

  renderSkills(byId("skills-container"), data.skills);
  renderExperience(byId("experience-container"), data.experience);
  renderEducation(byId("education-container"), data.education);
  renderLanguages(byId("languages-container"), data.languages);
  renderLinks(data.links);

  const now = new Date();
  byId("footer-year").textContent = String(now.getFullYear());
  byId("footer-name").textContent = data.name;
  byId("footer-location").textContent = data.location;
};

fetch(DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}`);
    }
    return response.json();
  })
  .then(render)
  .catch((error) => {
    console.error(error);
  });
