# CV Builder - Simple CV LaTeX Template

A web-based CV builder that generates a professional LaTeX CV based on the [Simple CV template from Overleaf](https://www.overleaf.com/latex/templates/simple-cv/wmsyrgqwwqnc).

## Features

- 🎨 Beautiful, modern web interface
- 📝 Easy-to-use form for all CV sections
- 🔄 Dynamic addition/removal of entries
- 📄 Generates LaTeX code ready for compilation
- 💾 Download as `.tex` file
- 📋 Copy to clipboard functionality
- 🎯 Based on the professional Simple CV template

## Sections Included

- Personal Information (Name, Email, Website, LinkedIn, GitHub)
- Education
- Experience
- Publications
- Teaching
- Skills
- Languages
- Projects
- Scholarships and Awards
- Extracurricular Activities

## Usage

### Option 1: Use the Web Interface (Recommended)

1. Open `index.html` in your web browser
2. Fill in all the relevant sections of your CV
3. Click "Generate LaTeX CV" or "Preview" to see the generated LaTeX code
4. Click "Download .tex File" to save the file
5. Compile the `.tex` file using a LaTeX compiler (e.g., pdflatex, xelatex, or upload to Overleaf)

### Option 2: Use the Template Directly

1. Open `cv-template.tex` in a text editor
2. Replace the placeholder content with your information
3. Compile using a LaTeX compiler

## Compiling the LaTeX File

### Using Overleaf (Easiest)

1. Go to [Overleaf](https://www.overleaf.com)
2. Create a new project
3. Upload your `cv.tex` file
4. Click "Recompile" to generate the PDF

### Using Local LaTeX Installation

If you have LaTeX installed locally:

```bash
pdflatex cv.tex
```

Or using XeLaTeX:

```bash
xelatex cv.tex
```

## File Structure

```
cv-builder/
├── index.html          # Main web interface
├── styles.css          # Styling for the web interface
├── script.js           # JavaScript for form handling and LaTeX generation
├── cv-template.tex     # Direct LaTeX template (can be edited manually)
└── README.md           # This file
```

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A LaTeX compiler (for compiling the generated `.tex` file):
  - Online: [Overleaf](https://www.overleaf.com) (recommended)
  - Local: TeX Live, MiKTeX, or MacTeX

## Tips

- **Date Formats**: Use formats like "2020-Current", "Summer 2019", "2018-2020"
- **Publications**: Follow the format shown in the placeholder text
- **Awards**: Use "Award Name ..... Year" format (dots will be converted to proper spacing)
- **Special Characters**: The form automatically escapes LaTeX special characters
- **Empty Sections**: Leave sections empty if you don't need them - they won't appear in the output

## Customization

### Modifying the Template

You can customize the LaTeX template by editing `cv-template.tex` or modifying the template string in `script.js`.

### Styling the Web Interface

Edit `styles.css` to change the appearance of the web interface.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is open source and available for personal and commercial use.

## Credits

Based on the [Simple CV template](https://www.overleaf.com/latex/templates/simple-cv/wmsyrgqwwqnc) from Overleaf.

## Support

If you encounter any issues:
1. Make sure all required fields are filled
2. Check that your LaTeX installation is up to date
3. Verify that all special characters are properly handled

---

**Note**: This is a static web application - no server or backend required. Just open `index.html` in your browser and start building your CV!

