import { useState } from 'react'
import './App.css'

const initialPortfolio = {
  personalInfo: {
    name: '',
    title: '',
    bio: '',
    email: '',
  },
  skills: [],
  projects: [],
}

const themes = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'creative', label: 'Creative' },
]

function getSafeUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function downloadPortfolio(portfolio, selectedTheme) {
  const { personalInfo, skills, projects } = portfolio
  const name = personalInfo.name.trim() || 'Portfolio'
  const projectMarkup = projects.length
    ? projects.map((project, index) => {
        const projectUrl = getSafeUrl(project.url)
        return `
          <article class="project-card">
            <div class="project-art"><span>${String(index + 1).padStart(2, '0')}</span><i>✳</i></div>
            <div class="project-details">
              <span class="project-type">PROJECT / ${String(index + 1).padStart(2, '0')}</span>
              <h3>${escapeHtml(project.title || 'Untitled project')}</h3>
              <p>${escapeHtml(project.description || 'A short description will go here.')}</p>
              ${projectUrl ? `<a href="${escapeHtml(projectUrl)}" rel="noreferrer" target="_blank">View project ↗</a>` : ''}
            </div>
          </article>`
      }).join('')
    : '<p class="empty">No projects added yet.</p>'
  const skillMarkup = skills.length
    ? skills.map((skill, index) => `
        <li class="skill-card">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(skill)}</strong>
          <i>✳</i>
        </li>`).join('')
    : '<p class="empty">No skills added yet.</p>'
  const safeEmail = personalInfo.email.trim()
  const contactMarkup = safeEmail
    ? `<a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)} ↗</a>`
    : '<p class="empty">Get in touch to start a conversation.</p>'
  const filename = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'portfolio'
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(personalInfo.bio || `${name}'s portfolio`)}">
  <title>${escapeHtml(name)} — Portfolio</title>
  <style>
    :root{font-family:Arial,Helvetica,sans-serif;color:#302f2b;background:#f8f6f1;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
    *{box-sizing:border-box}body{margin:0;--bg:#f8f6f1;--surface:#fffefa;--ink:#302f2b;--muted:#77746d;--accent:#a16845;--line:#e7e1d8;background:var(--bg);color:var(--ink)}
    body.minimalist{--bg:#f4f5f2;--surface:#fff;--ink:#292d2b;--muted:#69716d;--accent:#526e63;--line:#dfe4df}
    body.creative{--bg:#f8f1f7;--surface:#fffaff;--ink:#352a3b;--muted:#796c7c;--accent:#96649b;--line:#eaddec}
    a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
    .page{max-width:1080px;margin:auto;padding:0 40px}
    nav{min-height:76px;display:flex;align-items:center;gap:24px;border-bottom:1px solid var(--line)}
    .wordmark{max-width:45%;overflow:hidden;color:var(--ink);font-family:Georgia,serif;font-size:20px;text-overflow:ellipsis;white-space:nowrap}
    .wordmark span{color:var(--accent)}nav .links{display:flex;gap:24px;margin-left:auto}nav .links a{color:var(--muted);font-size:12px}
    .hero{min-height:420px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;position:relative;overflow:hidden;padding:70px 8%;border-bottom:1px solid var(--line);background:var(--surface)}
    .eyebrow,.section-label,.project-type{color:var(--accent);font-family:monospace;font-size:10px;letter-spacing:1.2px}
    .kicker{margin:45px 0 0;color:var(--muted);font-family:Georgia,serif;font-size:17px;font-style:italic}
    h1{z-index:1;max-width:82%;overflow-wrap:anywhere;margin:5px 0 0;font-family:Georgia,serif;font-size:clamp(52px,9vw,105px);font-weight:400;letter-spacing:-3px;line-height:.98}
    .title{margin:13px 0 0;color:var(--accent);font-size:16px}.bio{max-width:530px;margin:17px 0 0;color:var(--muted);font-family:Georgia,serif;font-size:15px;line-height:1.75}
    .decoration{position:absolute;top:50%;right:9%;color:var(--accent);font-size:clamp(110px,20vw,250px);line-height:1;opacity:.14;transform:translateY(-50%)}
    section.content{padding:75px 8%;border-bottom:1px solid var(--line)}.work{background:var(--surface)}
    h2{margin:12px 0 29px;font-family:Georgia,serif;font-size:clamp(30px,5vw,47px);font-weight:400;letter-spacing:-1px;line-height:1.08}
    .skills{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
    .skill-card{min-height:110px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;position:relative;padding:15px;border:1px solid var(--line);border-radius:6px;background:var(--surface);box-shadow:0 7px 18px #2d251d0a}
    .skill-card>span{color:var(--accent);font:8px monospace}.skill-card strong{max-width:calc(100% - 20px);overflow-wrap:anywhere;font:400 17px Georgia,serif}.skill-card i{position:absolute;right:13px;bottom:13px;color:var(--accent);font-style:normal}
    body.creative .skill-card:nth-child(even){background:var(--accent);color:white}body.creative .skill-card:nth-child(even)>span,body.creative .skill-card:nth-child(even) i{color:white}
    .projects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.project-card{overflow:hidden;border:1px solid var(--line);border-radius:7px;background:var(--bg)}
    .project-art{height:145px;display:flex;align-items:center;justify-content:space-between;padding:17px;background:color-mix(in srgb,var(--accent) 15%,var(--bg))}
    .project-art span{color:var(--accent);font:9px monospace}.project-art i{color:var(--accent);font-size:54px;font-style:normal;opacity:.65}
    .project-details{padding:19px}.project-type{font-size:8px}.project-details h3{margin:8px 0 0;font:400 22px Georgia,serif}.project-details p{margin:8px 0 0;color:var(--muted);font-size:12px;line-height:1.65}.project-details>a{display:inline-block;margin-top:17px;font-size:12px}
    body.minimalist .projects{grid-template-columns:1fr;gap:0}body.minimalist .project-card{display:grid;grid-template-columns:minmax(140px,.7fr) 1fr;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}body.minimalist .project-art{height:auto;min-height:155px}
    body.creative .project-card:nth-child(odd){transform:translateY(14px)}
    footer{min-height:230px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:20px;padding:52px 8% 30px}
    footer h2{margin:10px 0 0;font-size:clamp(27px,4vw,39px)}footer>p,footer>a{margin:0;color:var(--accent);font-size:13px}
    .copyright{grid-column:1/-1;padding-top:15px;border-top:1px solid var(--line);color:var(--muted);font:8px monospace;letter-spacing:.8px}.empty{color:var(--muted);font-size:12px}
    @media(max-width:600px){.page{padding:0 18px}nav{min-height:65px;gap:10px}nav .links{gap:10px}.wordmark{font-size:16px}nav .links a{font-size:10px}.hero{min-height:335px;padding:42px 4%}h1{max-width:100%;font-size:56px;letter-spacing:-2px}.kicker{margin-top:37px}.decoration{top:25%;right:3%;font-size:105px}section.content{padding:48px 4%}h2{font-size:34px}.skills{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.skill-card{min-height:92px;padding:12px}.projects{grid-template-columns:1fr}.project-card{transform:none!important}body.minimalist .project-card{grid-template-columns:105px 1fr}body.minimalist .project-art{min-height:125px}body.minimalist .project-details{padding:13px}body.minimalist .project-details h3{font-size:18px}footer{grid-template-columns:1fr;gap:15px;padding:42px 4% 24px}.copyright{grid-column:auto;margin-top:12px}}
    @media print{body{background:white}.page{max-width:none;padding:0 12mm}.hero,.content,footer{break-inside:avoid}.decoration{opacity:.08}}
  </style>
</head>
<body class="${escapeHtml(selectedTheme)}">
  <main class="page">
    <nav><a class="wordmark" href="#top">${escapeHtml(name)}<span>.</span></a><div class="links"><a href="#about">About</a><a href="#skills">Skills</a><a href="#work">Work</a>${safeEmail ? '<a href="#contact">Contact ↗</a>' : ''}</div></nav>
    <header class="hero" id="top"><p class="eyebrow">PORTFOLIO / ${escapeHtml(selectedTheme.toUpperCase())}</p><p class="kicker">Hello, I’m</p><h1>${escapeHtml(name)}</h1><p class="title">${escapeHtml(personalInfo.title || 'Your professional title')}</p><p class="bio" id="about">${escapeHtml(personalInfo.bio || 'A little introduction will make this page feel like yours.')}</p><span class="decoration" aria-hidden="true">✳</span></header>
    <section class="content" id="skills"><p class="section-label">01 / WHAT I DO</p><h2>A few things I bring<br>to the table.</h2><ul class="skills">${skillMarkup}</ul></section>
    <section class="content work" id="work"><p class="section-label">02 / SELECTED WORK</p><h2>Things I’ve made.</h2><div class="projects">${projectMarkup}</div></section>
    <footer id="contact"><div><p class="section-label">HAVE A GOOD ONE IN MIND?</p><h2>Let’s make it happen.</h2></div>${contactMarkup}<span class="copyright">© ${escapeHtml(name)} · MADE WITH INTENTION</span></footer>
  </main>
</body>
</html>`
  const file = new Blob([html], { type: 'text/html;charset=utf-8' })
  const downloadUrl = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = `${filename}-portfolio.html`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
}

function PortfolioPreview({ portfolio, selectedTheme, onBackToForm }) {
  const { personalInfo, skills, projects } = portfolio

  return (
    <div className={`final-portfolio final-${selectedTheme}`}>
      <header className="final-nav">
        <a className="final-wordmark" href="#top">
          {personalInfo.name || 'Portfolio'}
          <span>.</span>
        </a>
        <nav aria-label="Portfolio navigation">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#work">Work</a>
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`}>Contact ↗</a>}
        </nav>
        <button className="button final-back-button" onClick={onBackToForm} type="button">
          ← Back to form
        </button>
        <button
          className="button final-download-button"
          onClick={() => downloadPortfolio(portfolio, selectedTheme)}
          type="button"
        >
          Download portfolio ↓
        </button>
      </header>

      <section className="final-hero" id="top">
        <p className="final-eyebrow">PORTFOLIO / {selectedTheme.toUpperCase()}</p>
        <p className="final-hero-kicker">Hello, I’m</p>
        <h1>{personalInfo.name || 'Your name'}</h1>
        <p className="final-title">{personalInfo.title || 'Your professional title'}</p>
        <p className="final-bio" id="about">
          {personalInfo.bio || 'A little introduction will make this page feel like yours.'}
        </p>
        {personalInfo.email && (
          <a className="final-contact-link" href={`mailto:${personalInfo.email}`}>
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        )}
        <span className="final-hero-decoration" aria-hidden="true">✳</span>
      </section>

      <section className="final-section" id="skills">
        <div className="final-section-heading">
          <p>01 / WHAT I DO</p>
          <h2>A few things I bring<br />to the table.</h2>
        </div>
        {skills.length > 0 ? (
          <ul className="final-skill-grid">
            {skills.map((skill, index) => (
              <li className="final-skill-card" key={`${skill}-${index}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{skill}</strong>
                <i aria-hidden="true">✳</i>
              </li>
            ))}
          </ul>
        ) : (
          <p className="final-empty">Add skills in the form to introduce your toolkit.</p>
        )}
      </section>

      <section className="final-section final-work-section" id="work">
        <div className="final-section-heading">
          <p>02 / SELECTED WORK</p>
          <h2>Things I’ve made.</h2>
        </div>
        {projects.length > 0 ? (
          <div className={`final-project-grid final-projects-${selectedTheme}`}>
            {projects.map((project, index) => {
              const projectUrl = getSafeUrl(project.url)
              return (
                <article className="final-project-card" key={project.id}>
                  <div className="final-project-art" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <i>✳</i>
                  </div>
                  <div className="final-project-details">
                    <span className="final-project-type">PROJECT / {String(index + 1).padStart(2, '0')}</span>
                    <h3>{project.title || 'Untitled project'}</h3>
                    <p>{project.description || 'A short description will go here.'}</p>
                    {projectUrl && (
                      <a href={projectUrl} rel="noreferrer" target="_blank">
                        View project <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="final-empty">Add a project in the form to show your selected work.</p>
        )}
      </section>

      <footer className="final-footer" id="contact">
        <div>
          <p>HAVE A GOOD ONE IN MIND?</p>
          <h2>Let’s make it happen.</h2>
        </div>
        {personalInfo.email ? (
          <a href={`mailto:${personalInfo.email}`}>{personalInfo.email} <span aria-hidden="true">↗</span></a>
        ) : (
          <p className="final-empty">Add your email in the form to share your contact details.</p>
        )}
        <span className="final-copyright">© {personalInfo.name || 'PORTFOLIO'} · MADE WITH INTENTION</span>
      </footer>
    </div>
  )
}

function App() {
  const [portfolio, setPortfolio] = useState(initialPortfolio)
  const [selectedTheme, setSelectedTheme] = useState('modern')
  const [isEditing, setIsEditing] = useState(true)

  function updatePersonalInfo(event) {
    const { name, value } = event.target
    setPortfolio((current) => ({
      ...current,
      personalInfo: { ...current.personalInfo, [name]: value },
    }))
  }

  function addSkill(event) {
    event.preventDefault()
    const form = event.currentTarget
    const skill = new FormData(form).get('skill').trim()

    if (!skill) return

    setPortfolio((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }))
    form.reset()
  }

  function removeSkill(indexToRemove) {
    setPortfolio((current) => ({
      ...current,
      skills: current.skills.filter((_, index) => index !== indexToRemove),
    }))
  }

  function addProject() {
    setPortfolio((current) => ({
      ...current,
      projects: [
        ...current.projects,
        { id: crypto.randomUUID(), title: '', description: '', url: '' },
      ],
    }))
  }

  function updateProject(projectId, field, value) {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project,
      ),
    }))
  }

  function removeProject(projectId) {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== projectId),
    }))
  }

  const { personalInfo, skills, projects } = portfolio

  return (
    <main className={`app-shell ${isEditing ? '' : 'app-shell-generated'}`}>
      <header className="topbar">
        <a className="brand" href="#" aria-label="folio home">
          <span className="brand-mark">f.</span>
          <span>folio</span>
        </a>
        <span className="topbar-note">Your portfolio, your story.</span>
        <span className="save-status"><span /> {isEditing ? 'Preview updates live' : 'Portfolio generated'}</span>
      </header>

      {isEditing ? (
        <>
      <section className="intro">
        <div>
          <p className="eyebrow">PORTFOLIO BUILDER</p>
          <h1>Make a little room<br />for <span>your big ideas.</span></h1>
          <p className="intro-copy">
            Add your details and watch your portfolio take shape in real time.
          </p>
        </div>
        <div className="intro-art" aria-hidden="true">
          <span className="art-sun" />
          <span className="art-orbit orbit-one" />
          <span className="art-orbit orbit-two" />
          <span className="art-star">✳</span>
        </div>
      </section>

      <div className="builder-layout">
        <section className="editor" aria-label="Portfolio details">
          <div className="section-heading">
            <div className="step-number">01</div>
            <div>
              <h2>Your introduction</h2>
              <p>Start with the details people should know about you.</p>
            </div>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Name</span>
              <input
                autoComplete="name"
                name="name"
                onChange={updatePersonalInfo}
                placeholder="e.g. Alex Morgan"
                value={personalInfo.name}
              />
            </label>
            <label className="field">
              <span>Professional title</span>
              <input
                name="title"
                onChange={updatePersonalInfo}
                placeholder="e.g. Product designer"
                value={personalInfo.title}
              />
            </label>
            <label className="field field-full">
              <span>Short bio</span>
              <textarea
                name="bio"
                onChange={updatePersonalInfo}
                placeholder="A few words about what you do and what you love..."
                rows="4"
                value={personalInfo.bio}
              />
              <span className="field-hint">Keep it personal. Keep it you.</span>
            </label>
            <label className="field field-full">
              <span>Email address</span>
              <input
                autoComplete="email"
                name="email"
                onChange={updatePersonalInfo}
                placeholder="you@example.com"
                type="email"
                value={personalInfo.email}
              />
              <span className="field-hint">This will appear in your portfolio contact section.</span>
            </label>
          </div>

          <div className="editor-divider" />

          <div className="section-heading">
            <div className="step-number">02</div>
            <div>
              <h2>Your toolkit</h2>
              <p>What are you great at? Add a few skills.</p>
            </div>
          </div>

          <form className="add-skill-form" onSubmit={addSkill}>
            <label className="field skill-input">
              <span className="sr-only">Add a skill</span>
              <input
                aria-label="Add a skill"
                autoComplete="off"
                name="skill"
                placeholder="e.g. Figma, React, storytelling"
              />
            </label>
            <button className="button button-dark" type="submit">
              <span aria-hidden="true">+</span> Add skill
            </button>
          </form>

          {skills.length > 0 ? (
            <ul className="skill-list" aria-label="Your skills">
              {skills.map((skill, index) => (
                <li className="skill-chip" key={`${skill}-${index}`}>
                  {skill}
                  <button
                    aria-label={`Remove ${skill}`}
                    className="chip-remove"
                    onClick={() => removeSkill(index)}
                    type="button"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">Your skills will show up here.</p>
          )}

          <div className="editor-divider" />

          <div className="section-heading project-heading">
            <div className="step-number">03</div>
            <div>
              <h2>Selected projects</h2>
              <p>Share a few things you’ve made or are proud of.</p>
            </div>
            <button className="button button-outline add-project" onClick={addProject} type="button">
              <span aria-hidden="true">+</span> Add project
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="project-fields">
              {projects.map((project, index) => (
                <article className="project-editor-card" key={project.id}>
                  <div className="project-card-top">
                    <span>PROJECT {String(index + 1).padStart(2, '0')}</span>
                    <button
                      className="text-button"
                      onClick={() => removeProject(project.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="field">
                    <span>Project title</span>
                    <input
                      onChange={(event) => updateProject(project.id, 'title', event.target.value)}
                      placeholder="e.g. A better way to plan"
                      value={project.title}
                    />
                  </label>
                  <label className="field">
                    <span>Description</span>
                    <textarea
                      onChange={(event) =>
                        updateProject(project.id, 'description', event.target.value)
                      }
                      placeholder="What did you make, and why?"
                      rows="3"
                      value={project.description}
                    />
                  </label>
                  <label className="field">
                    <span>Project URL</span>
                    <input
                      onChange={(event) => updateProject(project.id, 'url', event.target.value)}
                      placeholder="https://..."
                      type="url"
                      value={project.url}
                    />
                  </label>
                </article>
              ))}
            </div>
          ) : (
            <button className="project-empty" onClick={addProject} type="button">
              <span className="empty-plus">+</span>
              <span><strong>Add your first project</strong><small>Include a title, short description, and link.</small></span>
              <span className="empty-arrow" aria-hidden="true">↗</span>
            </button>
          )}

          <div className="editor-divider" />

          <div className="section-heading theme-heading">
            <div className="step-number">04</div>
            <div>
              <h2>Pick your look</h2>
              <p>Choose a style that feels like you.</p>
            </div>
          </div>
          <div className="theme-options" role="group" aria-label="Portfolio theme">
            {themes.map((theme) => (
              <button
                aria-pressed={selectedTheme === theme.value}
                className={`theme-option ${selectedTheme === theme.value ? 'is-selected' : ''}`}
                key={theme.value}
                onClick={() => setSelectedTheme(theme.value)}
                type="button"
              >
                <span className={`theme-swatch swatch-${theme.value}`} aria-hidden="true">
                  <i /><i /><i />
                </span>
                <span>{theme.label}</span>
                <span className="theme-check" aria-hidden="true">
                  {selectedTheme === theme.value ? '✓' : ''}
                </span>
              </button>
            ))}
          </div>
          <div className="generate-row">
            <p>Your finished page will use the {selectedTheme} style.</p>
            <button className="button button-generate" onClick={() => setIsEditing(false)} type="button">
              Generate Portfolio <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>

        <aside className="preview-column">
          <div className="preview-heading">
            <div>
              <p className="eyebrow">LIVE PREVIEW</p>
              <h2>Your page, in progress</h2>
            </div>
            <span className="preview-live"><i /> LIVE</span>
          </div>
          <div className={`portfolio-preview theme-${selectedTheme}`}>
            <div className="preview-cover">
              <span className="preview-cover-label">PERSONAL PORTFOLIO</span>
              <span className="cover-shape shape-large" />
              <span className="cover-shape shape-small" />
              <span className="cover-spark">✳</span>
              <span className="cover-number">01 / 04</span>
            </div>
            <div className="preview-content">
              <div className="preview-identity">
                <div className="avatar" aria-hidden="true">
                  {personalInfo.name.trim() ? personalInfo.name.trim().charAt(0).toUpperCase() : 'Y'}
                </div>
                <div>
                  <h3>{personalInfo.name || 'Your name goes here'}</h3>
                  <p>{personalInfo.title || 'Your title or what you do'}</p>
                </div>
              </div>
              <p className="preview-bio">
                {personalInfo.bio || 'A little introduction will make this page feel like yours.'}
              </p>

              <div className="preview-section">
                <div className="preview-section-title">
                  <h4>A few things I do</h4><span>✳</span>
                </div>
                {skills.length > 0 ? (
                  <ul className="preview-skill-list">
                    {skills.map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}
                  </ul>
                ) : (
                  <p className="preview-placeholder">Your skills will land here.</p>
                )}
              </div>

              <div className="preview-section preview-projects">
                <div className="preview-section-title">
                  <h4>Things I’ve made</h4><span>{String(projects.length).padStart(2, '0')}</span>
                </div>
                {projects.length > 0 ? (
                  <div className="preview-project-list">
                    {projects.map((project, index) => {
                      const projectUrl = getSafeUrl(project.url)
                      return (
                        <article className="preview-project" key={project.id}>
                          <span className="preview-project-index">{String(index + 1).padStart(2, '0')}</span>
                          <div>
                            <h5>{project.title || 'Untitled project'}</h5>
                            <p>{project.description || 'A short description will go here.'}</p>
                          </div>
                          {projectUrl && (
                            <a aria-label={`Open ${project.title || 'project'}`} href={projectUrl} rel="noreferrer" target="_blank">
                              ↗
                            </a>
                          )}
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <p className="preview-placeholder">Your selected projects will appear here.</p>
                )}
              </div>
              <div className="preview-footer"><span>MADE WITH INTENTION</span><span>© FOLIO</span></div>
            </div>
          </div>
          <p className="preview-caption"><span>✦</span> This is a preview of your portfolio page.</p>
        </aside>
      </div>
      <footer className="page-footer">
        <span>GOOD WORK DESERVES A GOOD HOME.</span>
        <span>Built for your next chapter <span aria-hidden="true">↗</span></span>
      </footer>
        </>
      ) : (
        <PortfolioPreview
          onBackToForm={() => setIsEditing(true)}
          portfolio={portfolio}
          selectedTheme={selectedTheme}
        />
      )}
    </main>
  )
}

export default App
