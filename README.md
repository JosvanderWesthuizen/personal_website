# Jos van der Westhuizen - Personal Website

A professional personal website built with pure HTML, CSS, and JavaScript. Design inspired by [Jesse Zhang's website](https://jessezhang.org).

## Project Structure

```
.
├── index.html                 # Main page
├── css/
│   └── style.css             # All CSS styling
├── js/
│   └── main.js               # Theme toggle and blog loader
├── game/
│   ├── game.html             # Interactive banner game
│   └── game.js               # Game logic (space shooter)
├── blog/
│   ├── posts/
│   │   ├── post-1-deep-learning.html
│   │   ├── post-2-nlp.html
│   │   ├── post-3-neural-nets.html
│   │   ├── post-4-reinforcement-learning.html
│   │   └── post-5-future-ai.html
│   └── posts.json            # Blog post metadata
├── images/
│   ├── profile.jpg           # Profile photo (placeholder)
│   ├── favicon.svg           # Site favicon
│   └── blog-thumbnails/
│       ├── post-1.jpg
│       ├── post-2.jpg
│       ├── post-3.jpg
│       ├── post-4.jpg
│       └── post-5.jpg
└── README.md
```

## Features

- **Dark/Light Theme Toggle** - Persistent theme preference using localStorage
- **Interactive Banner Game** - Simple space shooter game embedded in header
- **Responsive Design** - Mobile-friendly layout that adapts to screen size
- **Dynamic Blog Posts** - Blog posts loaded from JSON for easy management
- **Timeline Bio** - Visual timeline for work history and education
- **Social Links** - Quick access to Twitter, LinkedIn, GitHub, Google Scholar
- **Video Embeds** - Section for recorded talks/presentations
- **Analytics Ready** - GoatCounter analytics integration

## Customization Guide

### 1. Update Personal Information

**In `index.html`:**
- Replace "Jos van der Westhuizen" with your name
- Update social media links (Twitter, LinkedIn, GitHub, Google Scholar)
- Update timeline entries in the "About" section
- Uncomment and add your YouTube video IDs in the "Recorded Talks" section

### 2. Add Your Profile Picture

Replace the placeholder in `index.html` (line 34-36):
```html
<!-- Before -->
Profile Photo

<!-- After -->
<img src="images/profile.jpg" alt="Your Name">
```

Then add your photo to `images/profile.jpg`.

### 3. Customize Blog Posts

**Option A: Edit `blog/posts.json`**
```json
{
    "id": 1,
    "title": "Your Post Title",
    "description": "Brief description of your post",
    "date": "Month Year",
    "url": "blog/posts/your-post.html",
    "thumbnail": "images/blog-thumbnails/your-post.jpg"
}
```

**Option B: Edit individual post files**
- Edit files in `blog/posts/` folder
- Update title, date, and content
- Add your own images to `images/blog-thumbnails/`

### 4. Setup Analytics

1. Sign up at [GoatCounter](https://www.goatcounter.com/)
2. Get your site code
3. Update line 173 in `index.html`:
```html
<script data-goatcounter="https://YOURSITE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
```

### 5. Customize Colors

Edit CSS variables in `css/style.css`:
```css
:root {
    --accent-color: #4f46e5;  /* Change this for light mode */
}

.dark {
    --accent-color: #6366f1;  /* Change this for dark mode */
}
```

### 6. Modify the Banner Game

The game is a simple space shooter. To customize:
- Edit `game/game.js` to change game mechanics
- Modify colors, speed, scoring in the game file
- Or replace entirely with your own interactive element

### 7. Add More Blog Posts

1. Create a new HTML file in `blog/posts/`
2. Copy the structure from an existing post
3. Add entry to `blog/posts.json`
4. Add thumbnail image to `images/blog-thumbnails/`

## Local Development

Simply open `index.html` in a web browser. No build process or server required!

For better development experience with a local server:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with npx)
npx serve
```

Then open `http://localhost:8000` in your browser.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Feel free to use this template for your own personal website. Attribution appreciated but not required.
