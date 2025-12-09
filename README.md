# CV Builder - Professional Resume Builder

A modern, web-based CV builder that generates professional PDF resumes with multiple beautiful templates. No LaTeX knowledge required - just fill in the form and download your CV as a PDF!

## Features

- 🎨 **5 Professional Templates**: Choose from Yodi, Classic, LuxSleek, Minimal, and Nabhel templates
- 📝 **Easy-to-Use Form**: Intuitive interface for all CV sections
- 🔄 **Dynamic Sections**: Add or remove entries dynamically (experience, projects, education, etc.)
- 📄 **Direct PDF Generation**: Download your CV as a PDF instantly using html2pdf.js
- 💾 **Auto-Save**: Your data is automatically saved to browser localStorage
- 🎯 **Page Customization**: Adjust paper size, orientation, and margins (top, bottom, left, right)
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🖨️ **Print-Optimized**: Templates are optimized for PDF generation and printing

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

### Getting Started

1. Open `index.html` in your web browser
2. Fill in all the relevant sections of your CV
3. Select a template from the template selector
4. Click "Preview CV" to see your CV with the selected template
5. In the preview:
   - Adjust page options (paper size, orientation, margins) using the fixed menu on the right
   - Click "Download PDF" to save your CV as a PDF file
   - Click "Back to Edit" to return to the form
   - Toggle dark/light theme as needed

### Page Options

In the preview mode, you'll find a fixed menu on the right side with page customization options:

- **Paper Size**: Choose from Letter, A4, or Legal
- **Orientation**: Portrait or Landscape
- **Margins**: Adjust top, bottom, left, and right margins (in millimeters)

All settings are automatically saved and will be applied when generating the PDF.

### Data Persistence

Your CV data is automatically saved to your browser's localStorage. This means:
- Your data persists between browser sessions
- You can close and reopen the page without losing your work
- Data is stored locally on your device (no server required)

## File Structure

```
cv-builder/
├── index.html              # Main form interface
├── script.js               # Core logic for form handling and CV generation
├── template/
│   ├── yodi.html          # Yodi template
│   ├── classic.html       # Classic template
│   ├── luxsleek.html      # LuxSleek template
│   ├── minimal.html       # Minimal template
│   └── nabhel.html        # Nabhel template
└── README.md              # This file
```

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required - works entirely in the browser
- No LaTeX installation needed - PDFs are generated client-side

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

## Customization

### Modifying Templates

Each template is a standalone HTML file in the `template/` directory. You can:
- Edit the HTML structure
- Modify CSS styles (inline or in style tags)
- Adjust the layout and design

### Adding New Templates

1. Create a new HTML file in the `template/` directory
2. Follow the structure of existing templates
3. Include the required JavaScript functions:
   - `loadPageSettings()` - Load saved page settings
   - `updateMargin()` - Update margin values
   - `updatePaperSize()` - Update paper size
   - `updateOrientation()` - Update orientation
   - `applyMargins()` - Apply margin styles
   - `savePageSettings()` - Save page settings
   - `downloadPDF()` - Generate and download PDF
   - `goBack()` - Return to form
4. Update `script.js` to include your template in the generation logic

## Technical Details

- **PDF Generation**: Uses [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) library
- **Styling**: Tailwind CSS for responsive design
- **Storage**: Browser localStorage for data persistence
- **No Dependencies**: All libraries are loaded via CDN

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues:
1. Make sure you're using a modern, up-to-date browser
2. Check browser console for any JavaScript errors
3. Ensure you have sufficient browser storage for localStorage
4. Try clearing browser cache if experiencing display issues

---

**Note**: This is a static web application - no server or backend required. Just open `index.html` in your browser and start building your CV!
