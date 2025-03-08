# Deploying Your iPhone Apps Website to GitHub Pages

This guide will walk you through deploying your website to GitHub Pages with a custom domain and HTTPS.

## Overview

GitHub Pages is a free hosting service offered by GitHub that allows you to host static websites directly from a GitHub repository. Your website will be available at `yourusername.github.io/repository-name` by default, but you can also set up a custom domain.

## Step 1: Create a GitHub Repository

1. Sign in to GitHub (or create an account if you don't have one at [github.com](https://github.com))
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., `my-iphone-apps` or `yourname.github.io`)
   - If you name it `yourusername.github.io` (using your actual username), your site will be published at `https://yourusername.github.io/`
   - Otherwise, it will be available at `https://yourusername.github.io/repository-name/`
4. Make the repository public (GitHub Pages requires this for free accounts)
5. Click "Create repository"

## Step 2: Upload Your Website Files

There are multiple ways to upload your files to GitHub:

### Option A: Using GitHub Desktop
1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Clone your new repository to your computer
3. Copy all your website files into the repository folder
4. Commit the changes and push to GitHub

### Option B: Using Git Command Line
1. Make sure Git is installed on your computer
2. Clone your repository:
   ```
   git clone https://github.com/yourusername/your-repository-name.git
   ```
3. Copy all your website files into the repository folder
4. Initialize Git and push the files:
   ```
   cd your-repository-name
   git add .
   git commit -m "Initial website commit"
   git push -u origin main
   ```

### Option C: Uploading via GitHub Web Interface
1. Navigate to your repository on GitHub
2. Click "Add file" > "Upload files"
3. Drag and drop your website files
4. Click "Commit changes"

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to the "GitHub Pages" section (or click "Pages" in the sidebar)
4. Under "Source", select the branch you want to publish (usually "main" or "master")
5. Select the folder where your site is located (usually the root / folder)
6. Click "Save"
7. GitHub will display a message with the URL where your site is published

## Step 4: Setting Up a Custom Domain (Optional)

If you want to use your own domain (e.g., `yourname.com`) instead of `yourusername.github.io`:

1. Purchase a domain from any domain registrar (like Namecheap, GoDaddy, or Google Domains)
2. In your repository settings, under "GitHub Pages" > "Custom domain", enter your domain name
3. Click "Save"
4. A file called `CNAME` will be added to your repository

### Configure DNS Records at Your Domain Registrar

1. Go to your domain registrar's website and log in
2. Find DNS settings for your domain
3. Add the following records:

   **Option 1: For an apex domain (example.com)**
   
   Add these A records pointing to GitHub's IP addresses:
   ```
   A   @   185.199.108.153
   A   @   185.199.109.153
   A   @   185.199.110.153
   A   @   185.199.111.153
   ```

   **Option 2: For a subdomain like www (www.example.com)**
   
   Add a CNAME record:
   ```
   CNAME   www   yourusername.github.io.
   ```

   **Option 3: For both apex domain and www subdomain**
   
   Add both the A records (for apex) and the CNAME record (for www)

4. Wait for DNS changes to propagate (can take up to 48 hours)

## Step 5: Enabling HTTPS

1. After your custom domain is set up, go back to the repository settings
2. In the "GitHub Pages" section, check "Enforce HTTPS"
   - Note: If the option is grayed out, wait a bit longer. GitHub needs to provision an SSL certificate for your domain
3. Wait for GitHub to provision an SSL certificate (can take up to 24 hours)

## Step 6: Handling Contact Form Submissions

Since GitHub Pages only hosts static sites, you'll need a third-party service to handle form submissions. Here are some free options:

### Option A: Formspree

1. Go to [Formspree](https://formspree.io) and sign up for a free account
2. Create a new form and note the unique form URL
3. Update your contact form in `index.html` to use this URL:

```html
<form id="contact-form" action="https://formspree.io/f/your-unique-endpoint" method="POST">
    <!-- Form fields remain the same -->
</form>
```

4. Update your `script.js` to remove the fetch API code and let Formspree handle the submission

### Option B: Netlify Forms

If you decide to also connect your GitHub repository to Netlify (another free hosting option), you can use Netlify Forms:

1. Add `netlify` attribute to your form:

```html
<form id="contact-form" netlify name="contact">
    <!-- Form fields remain the same -->
</form>
```

### Option C: Google Forms

1. Create a Google Form with fields matching your contact form
2. Get the form URL and either:
   - Link to it from your website
   - Embed it directly in your page

## Step 7: Testing Your Website

1. Visit your GitHub Pages URL or custom domain
2. Verify that:
   - All pages load correctly
   - Images and styling appear as expected
   - Navigation works
   - HTTPS is working (if you set up a custom domain)
   - Contact form submission works

## Updating Your Website

To update your website in the future:

1. Make changes to your local files
2. Commit and push the changes to GitHub:
   ```
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. GitHub Pages will automatically rebuild and deploy your updated site

## Troubleshooting

### Site Not Publishing
- Make sure your repository is public
- Check that you've selected the correct source branch
- Ensure index.html is in the correct location

### Custom Domain Not Working
- Verify DNS records are set correctly
- Wait for DNS propagation (up to 48 hours)
- Make sure CNAME file exists with your domain name

### HTTPS Not Working
- Wait for GitHub to provision the certificate (up to 24 hours)
- Ensure "Enforce HTTPS" is checked in settings

### Form Submission Not Working
- Check that you've correctly integrated with your form service
- Look for JavaScript errors in the browser console 