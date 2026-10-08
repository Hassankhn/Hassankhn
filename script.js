/* ==========================================================================
   HASSAN KHAN - PORTFOLIO INTERACTIVE LOGIC & GITHUB INTEGRATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Typewriter Effect
  initTypewriter();

  // 2. Fetch Live GitHub Profile Stats from GitHub API
  fetchGitHubData();

  // 3. Tab Filter Logic for Skills
  initSkillTabs();

  // 4. Copy Email & Toast Notification
  initCopyEmail();

  // 5. Stat Counter Animation on Scroll
  initCounters();

  // 6. Theme Toggler
  initThemeToggle();

  // 7. Interactive Terminal Switcher
  initTerminalTabs();
});

/* --------------------------------------------------------------------------
   1. TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const targetEl = document.getElementById('typewriter-text');
  if (!targetEl) return;

  const phrases = [
    'Lead Frontend Developer',
    'React & Next.js Architect',
    'SaaS & AI Products Specialist',
    'Frontend Systems Engineer'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      targetEl.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      targetEl.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
      typeSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   2. GITHUB LIVE DATA FETCHING
   -------------------------------------------------------------------------- */
async function fetchGitHubData() {
  const username = 'Hassankhn';
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error('GitHub API response not ok');
    const userData = await userRes.json();

    // Populate UI elements
    const ghReposEl = document.getElementById('gh-public-repos');
    const ghFollowersEl = document.getElementById('gh-followers');
    const ghAvatarEl = document.getElementById('gh-avatar-img');
    const ghBioEl = document.getElementById('gh-bio');

    if (ghReposEl) ghReposEl.textContent = userData.public_repos || '15+';
    if (ghFollowersEl) ghFollowersEl.textContent = userData.followers || '10+';
    if (ghAvatarEl && userData.avatar_url) ghAvatarEl.src = userData.avatar_url;
    if (ghBioEl && userData.bio) ghBioEl.textContent = userData.bio;

    // Fetch user public repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
    if (reposRes.ok) {
      const repos = await reposRes.json();
      renderRepos(repos);
    }
  } catch (err) {
    console.warn('GitHub API offline or rate-limited. Using fallback static stats.', err);
  }
}

function renderRepos(repos) {
  const reposContainer = document.getElementById('gh-repos-container');
  if (!reposContainer || !repos.length) return;

  reposContainer.innerHTML = repos.map(repo => `
    <div class="gh-repo-item">
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-1 1v.75c0 .138.112.25.25.25h4.75a.75.75 0 0 1 0 1.5H4.25A1.75 1.75 0 0 1 2 13.25V2.5zm2.5-.5a1 1 0 0 0-1 1v8.5c.346-.318.813-.5 1.333-.5h7.167V2H4.5z"/>
        </svg>
        ${repo.name}
      </a>
      <p class="repo-desc">${repo.description || 'Frontend engineering and React/Next.js architecture solutions.'}</p>
      <div style="margin-top: 10px; font-size: 0.78rem; color: var(--accent-cyan); font-weight: 600;">
        ⚡ ${repo.language || 'TypeScript'} • ⭐ ${repo.stargazers_count}
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   3. SKILLS MATRIX TABS FILTERING
   -------------------------------------------------------------------------- */
function initSkillTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. COPY EMAIL & TOAST
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'hassandev8@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied hassandev8@gmail.com to clipboard!');
    }).catch(() => {
      showToast('Email: hassandev8@gmail.com');
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* --------------------------------------------------------------------------
   5. STAT COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  window.addEventListener('scroll', () => {
    if (animated) return;
    const statsSection = document.getElementById('stats-section');
    if (!statsSection) return;

    const pos = statsSection.getBoundingClientRect().top;
    if (pos < window.innerHeight - 100) {
      animated = true;
      counters.forEach(c => {
        const target = +c.getAttribute('data-target');
        let count = 0;
        const speed = target / 30;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            c.textContent = Math.ceil(count);
            setTimeout(updateCount, 40);
          } else {
            c.textContent = target;
          }
        };
        updateCount();
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. THEME TOGGLE
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE TERMINAL CODE SWITCHER
   -------------------------------------------------------------------------- */
function initTerminalTabs() {
  const codeDisplay = document.getElementById('terminal-code-body');
  if (!codeDisplay) return;

  const snippets = {
    agentic: `
<span class="code-comment">// Human-in-the-Loop Agentic Development Workflow</span>
<span class="code-keyword">import</span> { AntigravityAgent, MCPRegistry } <span class="code-keyword">from</span> <span class="code-string">'@agentic/core'</span>;

<span class="code-keyword">export class</span> <span class="code-function">HumanInTheLoopPipeline</span> {
  <span class="code-keyword">async</span> <span class="code-function">executeJiraTask</span>(issueId: <span class="code-string">string</span>) {
    <span class="code-keyword">const</span> task = <span class="code-keyword">await</span> Jira.getIssue(issueId);
    <span class="code-keyword">const</span> plan = <span class="code-keyword">await</span> AntigravityAgent.inspectAndPlan(task);

    <span class="code-comment">// Strict boundary: requires human approval before code mutation</span>
    <span class="code-keyword">if</span> (!<span class="code-keyword">await</span> HumanReview.approve(plan)) <span class="code-keyword">return</span>;

    <span class="code-keyword">const</span> result = <span class="code-keyword">await</span> AntigravityAgent.applyChanges(plan);
    <span class="code-keyword">return</span> GitHub.createPullRequest(result);
  }
}`,
    config: `
<span class="code-comment">// Lead Frontend Developer Profile Configuration</span>
<span class="code-keyword">const</span> HassanKhan = {
  name: <span class="code-string">"Hassan Khan"</span>,
  title: <span class="code-string">"Lead Frontend Developer"</span>,
  status: <span class="code-string">"Remote & Open to Relocate"</span>,
  experienceYears: <span class="code-number">3.5</span>,
  coreStack: [<span class="code-string">"React.js"</span>, <span class="code-string">"TypeScript"</span>, <span class="code-string">"Next.js"</span>, <span class="code-string">"Frontend Architecture"</span>, <span class="code-string">"React Native"</span>],
  impact: {
    clientRating: <span class="code-string">"4.8★"</span>,
    domain: <span class="code-string">"SaaS, Enterprise Software, FinTech & AI Products"</span>,
    agenticAI: <span class="code-string">"Antigravity, MCP, Jira & GitHub Workflows"</span>
  }
};`
  };

  const btnAgent = document.getElementById('terminal-tab-rn');
  const btnCfg = document.getElementById('terminal-tab-cfg');

  if (btnAgent && btnCfg) {
    btnAgent.addEventListener('click', () => {
      codeDisplay.innerHTML = snippets.agentic;
      btnAgent.style.color = 'var(--accent-cyan)';
      btnCfg.style.color = 'var(--text-muted)';
    });

    btnCfg.addEventListener('click', () => {
      codeDisplay.innerHTML = snippets.config;
      btnCfg.style.color = 'var(--accent-cyan)';
      btnAgent.style.color = 'var(--text-muted)';
    });
  }
}
