# ChaseWhiteRabbit GitHub Pages Website

This repository includes a Vue.js-based website that serves as the GitHub Pages site for the ChaseWhiteRabbit project.

## Website Location

The website source code is located in the `/website` directory.

## Quick Start

```bash
# Navigate to website directory
cd website

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the master or main branch. The deployment is handled by the `.github/workflows/pages-vue.yml` workflow.

### Deployment URL

Once deployed, the website is accessible at: https://tiaastor.github.io/ChaseWhiteRabbit/

## Technology Stack

- Vue 3 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Vue Router for navigation
- Pinia for state management

## Features

The website showcases:
- TiaAstor's main GitHub repositories
- Links to key projects including ChaseWhiteRabbit, 19 Trillion Solution, and RiggerConnect
- Modern, responsive design with dark mode support
- Company intranet-style navigation and information architecture

## Contributing

To contribute to the website:
1. Make changes in the `/website` directory
2. Test locally with `npm run dev`
3. Build and verify with `npm run build && npm run preview`
4. Submit a pull request

For more detailed information, see the README in the `/website` directory.
