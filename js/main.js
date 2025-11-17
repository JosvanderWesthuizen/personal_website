// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        themeIcon.textContent = '☀️ Light';
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        themeIcon.textContent = '🌙 Dark';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    if (savedTheme === 'light') {
        html.classList.remove('dark');
        themeIcon.textContent = '☀️ Light';
    } else {
        // Default to dark mode
        html.classList.add('dark');
        themeIcon.textContent = '🌙 Dark';
    }
}

// Load blog posts from JSON
async function loadBlogPosts() {
    try {
        const response = await fetch('blog/posts.json');
        const posts = await response.json();
        const blogContainer = document.getElementById('blog-posts');

        if (!blogContainer) return;

        blogContainer.innerHTML = posts.map(post => `
            <a href="${post.url}" class="blog-card">
                <div class="blog-thumbnail">
                    ${post.thumbnail ?
                        `<img src="${post.thumbnail}" alt="${post.title}">` :
                        'Image'
                    }
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-description">${post.description}</p>
                    <div class="blog-date">${post.date}</div>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadBlogPosts();

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
