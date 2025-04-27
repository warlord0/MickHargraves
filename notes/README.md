# Black Eyes & Broken Souls Lore Documentation

This project sets up a Docusaurus-powered documentation site for the extensive lore of "Black Eyes & Broken Souls" with a built-in search function, dark-themed design, and well-organized navigation.

## Essential Files

The project consists of the following essential components:

### Core Configuration
- `Dockerfile` - Instructions for building the Docker container
- `compose.yml` - Docker Compose configuration
- `docusaurus-init.sh` - Main initialization script
- `run.sh` - Convenience script to start Docker
- `update-lore.sh` - Script to update lore documents

### Docusaurus Configuration
- `config/docusaurus.config.js` - Main Docusaurus configuration
- `config/sidebars.js` - Navigation sidebar structure

### Styling
- `styles/custom.css` - Basic styling
- `styles/horror-theme.css` - Horror-themed design elements
- `styles/search.css` - Search page styling
- `styles/style.module.css` - Homepage styling modules

### Pages
- `pages/index.js` - Homepage React component
- `pages/search.js` - Search page React component

### Custom Theme
- `theme/ColorModeToggle/index.js` - Custom theme toggle component
- `theme/ColorModeToggle/styles.module.css` - Styling for theme toggle

### Utilities
- `utils/fix-markdown-links.sh` - Script to fix markdown links and add frontmatter

### Static Assets
- `images/logo.svg` - Site logo
- `images/dark-bg.jpg` - Background image for homepage

## Getting Started

1. Make sure you have Docker and Docker Compose installed

2. Make the run script executable:
   ```bash
   chmod +x run.sh
   ```

3. Start the Docker container:
   ```bash
   ./run.sh
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Adding or Updating Lore

1. Add or modify files in the `lore/` directory

2. Run the update script:
   ```bash
   ./update-lore.sh
   ```

3. Restart the Docker container to see your changes:
   ```bash
   docker compose restart
   ```

## Customizing the Documentation

### Navigation Structure
Edit `config/sidebars.js` to change how your lore documents are organized.

### Theme and Appearance
Modify files in the `styles/` directory to adjust the appearance.

### Homepage Content
Edit `pages/index.js` to change the content of the homepage.

## Troubleshooting

If you encounter issues:

- Check Docker logs: `docker compose logs`
- Ensure all necessary files are in their correct directories
- Make sure scripts have execute permissions: `chmod +x *.sh`
- Try rebuilding the container: `docker compose up --build`

## Building for Production

When you're ready to deploy your documentation:

```bash
cd website
npm run build
```

This will generate a static site in the `website/build` directory, which you can deploy to any static hosting service.