const tasks = {
  "home": "",
  "task1": "",
  "task2": "",
  "task3": "",
  "task4": "",
  "conclusion": "",
  "404": `
    <div class="task-card" style="text-align: center;">
      <h1>404: Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="#home" class="pdf-button" style="background-color: var(--link-color);">Return to Home</a>
    </div>
  `
};

// Determine which page we are viewing
const path = window.location.pathname;
const isSSB = path.includes("ssb.html");
const isLDE = path.includes("lde.html"); // Formerly index.html content
const isHub = path.endsWith("index.html") || path.endsWith("/") || (!isSSB && !isLDE);

// Define content mapping ONLY if we are not on the Hub
let contentFiles = {};

if (isSSB) {
    contentFiles = {
        home: "SSB_Home.html",
        task1: "SSB_Task1.html",
        task2: "SSB_Task2.html",
        task3: "SSB_Task3.html",
        task4: "SSB_Task4.html",
        conclusion: "SSB_Conclusion.html"
    };
} else if (isLDE) {
    contentFiles = {
        home: "Home.html",
        task1: "Task1.html",
        task2: "Task2.html",
        task3: "Task3.html",
        task4: "Task4.html",
        conclusion: "" 
    };
}

// Only fetch and render if we are on a content page (LDE or SSB), NOT on the Hub
if (!isHub && Object.keys(contentFiles).length > 0) {
    const fetchPromises = [
      fetch(contentFiles.home).then(r => r.ok ? r.text() : "").then(html => { tasks.home = html; }),
      fetch(contentFiles.task1).then(r => r.ok ? r.text() : "").then(html => { tasks.task1 = html; }),
      fetch(contentFiles.task2).then(r => r.ok ? r.text() : "").then(html => { tasks.task2 = html; }),
      fetch(contentFiles.task3).then(r => r.ok ? r.text() : "").then(html => { tasks.task3 = html; }),
      fetch(contentFiles.task4).then(r => r.ok ? r.text() : "").then(html => { tasks.task4 = html; })
    ];

    if(contentFiles.conclusion) {
        fetchPromises.push(fetch(contentFiles.conclusion).then(r => r.ok ? r.text() : "").then(html => { tasks.conclusion = html; }));
    }

    Promise.all(fetchPromises).then(() => {
      renderTask(getPage()); 
    });
}

function getPage() {
  const hash = location.hash.replace("#", "");
  return (!hash || hash === "home") ? "home" : hash;
}

function renderTask(page) {
    const app = document.getElementById("app");
    const loader = document.getElementById("loader");

    // If elements don't exist (e.g. on Hub page), exit
    if(!app || !loader) return;

    // Show loader, hide content
    loader.style.display = "block";
    app.style.display = "none";
    
    setTimeout(() => {
        const pageContent = (tasks.hasOwnProperty(page) && tasks[page]) ? tasks[page] : tasks["404"];
        app.innerHTML = pageContent;

        loader.style.display = "none";
        app.style.display = "block";

        // Update nav active state
        ["navHome","nav1","nav2","nav3","nav4","navConclusion"].forEach(id => {
            const el = document.getElementById(id); if(el) el.classList.remove("active");
        });

        let activeNavId = '';
        if (page === 'home') {
            activeNavId = 'navHome';
        } else if (page === 'conclusion') {
            activeNavId = 'navConclusion';
        } else {
            activeNavId = tasks.hasOwnProperty(page) ? `nav${page.replace('task', '')}` : '';
        }

        if (activeNavId && document.getElementById(activeNavId)) {
            document.getElementById(activeNavId).classList.add("active");
        }

        // Close mobile menu
        const nav = document.getElementById('main-nav');
        const toggle = document.querySelector('.menu-toggle');
        if (nav && nav.classList.contains('menu-open')) {
            nav.classList.remove('menu-open');
            if(toggle) toggle.classList.remove('open');
        }

        activateReferenceLinks();
        initLightbox();
        window.scrollTo(0, 0);
    }, 150);
}

// Hash change handler (Only relevant for SPA pages)
window.addEventListener("hashchange", function() {
  if(isHub) return; // Do nothing on Hub
  const hash = location.hash.replace("#", "");
  if (hash.startsWith('ref')) {
    const ref = document.getElementById(hash);
    if (ref) {
      openParentCardIfClosed(ref);
      ref.classList.add("ref-highlight");
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => ref.classList.remove("ref-highlight"), 5000);
    }
    return;
  }
  renderTask(getPage());
});

// Home logo -> home (SPA only)
const homeLink = document.getElementById("home-link");
if(homeLink && !isHub) {
    homeLink.onclick = function() { location.hash = "#home"; };
}

// Reference highlight handlers
function activateReferenceLinks() {
  document.querySelectorAll('.ref-link').forEach(link => {
    link.addEventListener('mouseenter', highlightReference);
    link.addEventListener('mouseleave', unhighlightReference);
    link.addEventListener('click', function(e) {
      const refId = (this.getAttribute('href') || '').replace('#', '');
      const ref = document.getElementById(refId);
      if (ref) {
        openParentCardIfClosed(ref);
        ref.classList.add('ref-highlight');
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => ref.classList.remove('ref-highlight'), 5000);
        e.preventDefault();
      }
    });
  });

  function highlightReference() {
    const refId = (this.getAttribute('href') || '').replace('#', '');
    const ref = document.getElementById(refId);
    if(ref) ref.classList.add('ref-highlight');
  }
  function unhighlightReference() {
    const refId = (this.getAttribute('href') || '').replace('#', '');
    const ref = document.getElementById(refId);
    if(ref) ref.classList.remove('ref-highlight');
  }
}

function openParentCardIfClosed(elementInside) {
  if(!elementInside) return;
  const parentCard = elementInside.closest('.task-card1');
  if(!parentCard) return;
  if(parentCard.classList.contains('collapsed')) {
    parentCard.classList.remove('collapsed');
    const btn = parentCard.querySelector('.collapse-btn');
    if(btn) btn.textContent = '−';
  }
}

window.toggleCard = function(header) {
  const card = header.closest('.task-card1');
  if(!card) return;
  card.classList.toggle("collapsed");
  const btn = card.querySelector('.collapse-btn');
  if(btn) {
    btn.textContent = card.classList.contains('collapsed') ? '+' : '−';
  }
};

/* Floating logo adjust */
(function() {
  const logo = document.querySelector('.floating-logo');
  const footer = document.querySelector('.gh-footer');
  if (!logo || !footer) return;
  const margin = 18;

  function updateLogoPosition() {
    const footerRect = footer.getBoundingClientRect();
    const overlap = Math.max(0, window.innerHeight - footerRect.top);
    logo.style.bottom = (overlap > 0) ? `${overlap + margin}px` : `${margin}px`;
  }

  window.addEventListener('scroll', updateLogoPosition, { passive: true });
  window.addEventListener('resize', updateLogoPosition);
  window.addEventListener('load', () => setTimeout(updateLogoPosition, 100));
})();


/* Light/Dark Theme Toggle (Shared across all pages) */
(function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        });
    }
})();

/* Mobile Menu Toggle Logic */
(function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    
    if(menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('open');
            nav.classList.toggle('menu-open');
        });
    }
})();

/* Lightbox for Galleries */
function initLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;

    const imgEl = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentGalleryLinks = [];
    let currentIndex = 0;

    const galleries = document.querySelectorAll('.screenshot-gallery, .refworks-gallery, .refworks-gallery-ssb2');

    galleries.forEach(gallery => {
        const links = Array.from(gallery.querySelectorAll('a'));
        
        links.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentGalleryLinks = links;
                openLightbox(index);
            });
        });
    });

    function openLightbox(index) {
        currentIndex = index;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateImage();
    }

    function updateImage() {
        const link = currentGalleryLinks[currentIndex];
        const imgSrc = link.href;
        const captionText = link.dataset.caption || link.closest('figure')?.querySelector('figcaption')?.textContent || '';
        
        imgEl.src = imgSrc;
        captionEl.textContent = captionText;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === currentGalleryLinks.length - 1;
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateImage();
        }
    }

    function showNext() {
        if (currentIndex < currentGalleryLinks.length - 1) {
            currentIndex++;
            updateImage();
        }
    }

    function closeLightbox() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (overlay.style.display !== 'flex') return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeLightbox();
    });
}

/* Scroll to Top Button Logic */
(function() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();