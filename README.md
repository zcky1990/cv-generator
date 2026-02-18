# CV Builder - Professional Resume Builder

A modern, web-based CV builder built with **Vue 3**, **Vite**, and **shadcn-vue**. It generates professional PDF resumes with multiple templates. Fill in the form and download your CV as a PDF.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** – build tool and dev server
- **Pinia** – state management for CV data
- **Vue Router** – routing
- **shadcn-vue** – UI components (Button, Input, Label, Card, Textarea)
- **Tailwind CSS v4** – styling with CSS variables (light/dark)
- **TypeScript** – type-safe code

## Features

- 🎨 **Multiple Templates**: Minimal, Modern, Nabhel, Yodi, Harvard (rendered at `/preview`)
- 📝 **Easy-to-Use Form**: Intuitive form built with shadcn-vue components
- 🔄 **Dynamic Sections**: Add or remove education, experience, volunteer, languages, projects
- 📄 **PDF Generation**: Download your CV as PDF from the preview page (jsPDF + html2canvas)
- 💾 **Auto-Save**: Data is synced to `localStorage` and persists across sessions
- 🎯 **Page Customization**: Paper size, orientation, and margins on the template page
- 🌓 **Dark Mode**: Toggle light/dark theme
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🖨️ **Print-Optimized**: Templates are optimized for PDF and printing

## Templates

1. **Yodi** - Modern, clean design with emphasis on visual hierarchy
2. **Classic** - Traditional professional layout with balanced spacing
3. **LuxSleek** - Elegant and sophisticated design
4. **Minimal** - Clean and minimalist approach
5. **Nabhel** - Structured layout with clear sections

## Sections Included

- **Personal Information**: Name, title, email, phone, location, website, LinkedIn, GitHub
- **Summary/About**: Professional summary or about section
- **Experience**: Work history with company, position, dates, and descriptions
- **Education**: Academic background with institution, degree, and dates
- **Projects**: Portfolio projects with descriptions and links
- **Skills**: Technical and soft skills
- **Certificates**: Professional certifications
- **Languages**: Language proficiency
- **Contact**: Additional contact information

## Usage

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 and use the CV builder form.

### Build for Production

```bash
npm run build
```

Then serve the `dist/` folder (e.g. with `npx serve dist` or your host). The app will be at `/` and template previews at `/preview`.

### Deploy to GitHub Pages

The repo includes a GitHub Action that builds and deploys to GitHub Pages on every push to `main`.

1. In your GitHub repo go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site will be available at `https://<username>.github.io/<repo>/` (e.g. `https://username.github.io/cv-builder/`).

### Getting Started

1. Run the app and open the builder.
2. Fill in personal info, education, experience, and other sections.
3. Select a template (Minimal, Modern, Nabhel, Yodi, Harvard).
4. Click **Generate CV Preview** – you’ll be taken to the template page with your data.
5. On the template page:
   - Adjust page options (paper size, orientation, margins) if available.
   - Click **Download PDF** to save the CV as PDF.
   - Click **Back to Edit** to return to the Vue builder.
   - Toggle dark/light theme as needed.

### Page Options

In the preview mode, you'll find a fixed menu on the right side with page customization options:

- **Paper Size**: Choose from Letter, A4, or Legal
- **Orientation**: Portrait or Landscape
- **Margins**: Adjust top, bottom, left, and right margins (in millimeters)

All settings are automatically saved and will be applied when generating the PDF.

### Data Persistence

Your CV Preview data is automatically saved to your browser's localStorage. This means:
- Your data persists between browser sessions
- You can close and reopen the page without losing your work
- Data is stored locally on your device (no server required)

## File Structure

```
cv-builder/
├── index.html              # Vite entry (mounts Vue app)
├── src/
│   ├── main.ts             # Vue app entry
│   ├── App.vue
│   ├── style.css            # Tailwind + theme variables
│   ├── router/              # Vue Router (/, /preview)
│   ├── stores/              # Pinia store (CV data)
│   ├── types/              # TypeScript types for CV
│   ├── views/               # BuilderView, PreviewView
│   ├── components/ui/       # shadcn-vue components
│   └── lib/utils.ts
├── public/
│   ├── script.js           # CV HTML generators (generateCVFromData, etc.)
│   └── images/
├── package.json
├── vite.config.ts
└── README.md
```

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required - works entirely in the browser

## Browser Compatibility

- Chrome/Edge (latest) ✅
- Firefox (latest) ✅
- Safari (latest) ✅

## Tips

- **Date Formats**: Use formats like "2020 - Present", "Jan 2019 - Dec 2020", "2018-2020"
- **Empty Sections**: Leave sections empty if you don't need them - they won't appear in the output
- **Multiple Entries**: Use the "+ Add" buttons to add multiple entries to sections like Experience, Education, Projects, etc.
- **Page Margins**: Adjust margins based on your content and printer requirements
- **Template Selection**: Try different templates to see which one best showcases your experience

## Technical Details

- **Vue 3**: Composition API, `<script setup>`, reactive state with Pinia.
- **shadcn-vue**: Copy-paste components (Button, Input, Label, Card, Textarea) with Tailwind and Radix Vue.
- **Templates**: CV HTML is generated by `public/script.js` (`generateCVFromData`); the Vue app renders it at `/preview`.
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://github.com/niklasvh/html2canvas) in PreviewView.
- **Styling**: Tailwind CSS v4 with CSS variables for light/dark theme.
- **Storage**: CV data in Pinia store and synced to `localStorage` (key `cvData`).

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues:
1. Make sure you're using a modern, up-to-date browser
2. Check browser console for any JavaScript errors
3. Ensure you have sufficient browser storage for localStorage
4. Try clearing browser cache if experiencing display issues

---

**Note**: Run `npm run dev` to start the development server, or `npm run build` and serve `dist/` for production.
