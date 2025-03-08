# iPhone Apps Showcase Website

A simple, modern website for showcasing your iPhone apps from the App Store.

## Features

- Modern, responsive design that works on all devices
- Dedicated sections for showcasing your apps
- About section to tell visitors about yourself
- Contact form for user feedback (via Formspree)
- Easy to customize and extend
- Free hosting via GitHub Pages with SSL

## File Structure

```
/
├── index.html                # Main HTML file
├── thank-you.html            # Thank you page after form submission
├── 404.html                  # Custom 404 error page
├── CNAME                     # For custom domain configuration
├── robots.txt                # Search engine crawl instructions
├── sitemap.xml               # Site structure for search engines
├── css/
│   └── styles.css            # CSS styles
├── js/
│   └── script.js             # JavaScript functionality
├── images/                   # Directory for app icons and other images
│   └── placeholder-instructions.txt
├── github-pages-guide.md     # Detailed guide for GitHub Pages deployment
└── README.md                 # This file
```

## Getting Started

1. Replace the placeholder app information in `index.html` with details about your actual iPhone apps.
2. Add your app icons to the `images/` directory.
3. Update the App Store links to point to your actual apps.
4. Customize the about section with information about yourself.
5. Set up the contact form with Formspree (see below).
6. Deploy to GitHub Pages (see github-pages-guide.md).

## Setting Up the Contact Form

The contact form uses [Formspree](https://formspree.io) for processing:

1. Create a free Formspree account at [formspree.io](https://formspree.io)
2. Create a new form and get your unique form ID
3. Open `index.html` and replace `YOUR_FORM_ID` in the form action URL:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Update the hidden fields if needed:
   ```html
   <input type="hidden" name="_next" value="https://yourusername.github.io/thank-you.html">
   ```

## Customizing Your Website

### Changing Colors

The website uses CSS variables for colors. Open `css/styles.css` and edit:

```css
:root {
    --primary-color: #007aff;
    --secondary-color: #5ac8fa;
    --dark-color: #1d1d1f;
    --light-color: #f5f5f7;
    --success-color: #34c759;
    --danger-color: #ff3b30;
}
```

### Adding More Apps

Copy an existing app card in `index.html` and customize:

```html
<div class="app-card">
    <div class="app-icon">
        <img src="images/your-app-icon.png" alt="App Name">
    </div>
    <div class="app-info">
        <h3>Your App Name</h3>
        <p>Description of your app</p>
        <div class="app-meta">
            <span><i class="fas fa-star"></i> 4.8</span>
            <span><i class="fas fa-download"></i> 10K+</span>
        </div>
        <a href="https://apps.apple.com/app/idYOUR_APP_ID" class="app-store-btn">
            <i class="fab fa-app-store-ios"></i> Download on App Store
        </a>
    </div>
</div>
```

## Deploying to GitHub Pages

See the detailed instructions in [github-pages-guide.md](github-pages-guide.md).

## Using a Custom Domain

1. Purchase a domain from any domain registrar
2. Update the CNAME file with your domain
3. Configure DNS records as outlined in github-pages-guide.md
4. Enable HTTPS in your GitHub repository settings

## License

This project is open source and available under the [MIT License](LICENSE). 