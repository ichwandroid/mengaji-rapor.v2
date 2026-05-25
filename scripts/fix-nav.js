const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html') && f !== 'login.html');

const menus = [
  { id: 'dashboard', path: '/dashboard', label: 'Home', icon: 'ph-house', admin: false },
  { id: 'users', path: '/users', label: 'User', icon: 'ph-identification-badge', admin: true },
  { id: 'siswa', path: '/siswa', label: 'Siswa', icon: 'ph-graduation-cap', admin: false },
  { id: 'materi', path: '/materi', label: 'Materi', icon: 'ph-books', admin: true },
  { id: 'tahfizh-quran', path: '/tahfizh-quran', label: "Tahfizh Al-Qur'an", icon: 'ph-book-open-text', admin: true },
  { id: 'bilqolam', path: '/bilqolam', label: 'Bilqolam', icon: 'ph-book-bookmark', admin: true },
  { id: 'doa-harian', path: '/doa-harian', label: "Do'a Sehari-hari", icon: 'ph-hands-praying', admin: true },
  { id: 'tathbiq-ibadah', path: '/tathbiq-ibadah', label: 'Tathbiq Ibadah', icon: 'ph-mosque', admin: true },
  { id: 'laporan', path: '/laporan', label: 'Laporan', icon: 'ph-file-text', admin: true },
];

function generateAside(activeId) {
  let navLinks = menus.map(m => {
    const isActive = m.id === activeId;
    const adminAttr = m.admin ? ' data-admin-only' : '';
    const linkClass = isActive 
      ? 'flex h-11 items-center gap-3 rounded-[8px] bg-emeraldDeep px-4 text-sm font-bold text-white shadow-soft'
      : 'flex h-11 items-center gap-3 rounded-[8px] px-4 text-sm font-bold text-ink/70 transition hover:bg-white hover:text-emeraldDeep';
    
    return `            <a${adminAttr} href="${m.path}" class="${linkClass}">
              <i class="ph ${m.icon} text-xl"></i>
              ${m.label}
            </a>`;
  }).join('\n');

  return `<aside class="hidden w-72 shrink-0 border-r border-emeraldDeep/10 bg-white/68 px-5 py-6 backdrop-blur-xl lg:block">
          <a href="/dashboard" class="flex items-center gap-3" aria-label="Dashboard Rapor Mengaji">
            <span class="grid h-11 w-11 place-items-center rounded-[8px] bg-emeraldDeep text-white shadow-soft">
              <i class="ph ph-moon-stars text-2xl"></i>
            </span>
            <span>
              <span class="block font-display text-base font-extrabold leading-5 text-emeraldDeep">Rapor Mengaji</span>
              <span class="block text-xs font-semibold uppercase tracking-[0.24em] text-dateGold">SD Anak Saleh</span>
            </span>
          </a>

          <nav class="mt-10 space-y-2" aria-label="Menu dashboard">
${navLinks}
          </nav>
        </aside>`;
}

function generateMobileNav(activeId) {
  let navLinks = menus.map(m => {
    const isActive = m.id === activeId;
    const adminAttr = m.admin ? ' data-admin-only' : '';
    const linkClass = isActive 
      ? 'flex h-11 items-center justify-center gap-2 rounded-[8px] bg-emeraldDeep px-4 text-sm font-bold text-white shadow-soft'
      : 'flex h-11 items-center justify-center gap-2 rounded-[8px] border border-emeraldDeep/10 bg-white/75 px-4 text-sm font-bold text-emeraldDeep transition hover:bg-white';
    
    return `              <a${adminAttr} href="${m.path}" class="${linkClass}">
                <i class="ph ${m.icon} text-lg lg:hidden"></i>
                ${m.label}
              </a>`;
  }).join('\n');

  return `<nav class="mb-6 flex flex-wrap gap-2 lg:hidden" aria-label="Menu dashboard mobile">\n${navLinks}\n            </nav>`;
}

for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(publicDir, file), 'utf8');
  const activeId = file.replace('.html', '');
  
  // Inject Phosphor Icons script if not present
  if (!content.includes('@phosphor-icons')) {
    content = content.replace('</head>', '  <script src="https://unpkg.com/@phosphor-icons/web"></script>\n  </head>');
  }

  // Replace aside
  const asideRegex = /<aside class="hidden w-72 shrink-0.*?<\/aside>/s;
  if (asideRegex.test(content)) {
    content = content.replace(asideRegex, generateAside(activeId));
  }
  
  // Replace mobile nav
  const mobileNavRegex = /<nav class="mb-6 flex flex-wrap gap-2 lg:hidden" aria-label="Menu dashboard mobile">.*?<\/nav>/s;
  if (mobileNavRegex.test(content)) {
    content = content.replace(mobileNavRegex, generateMobileNav(activeId));
  }
  
  fs.writeFileSync(path.join(publicDir, file), content, 'utf8');
  console.log(`Updated nav and icons in ${file}`);
}
