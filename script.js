// Collect form data
// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        event.target.value = '';
        return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        // Store in a hidden input or directly in localStorage temporarily
        document.getElementById('photo').setAttribute('data-photo', photoData);
        
        // Show preview
        const preview = document.getElementById('photoPreview');
        const previewImg = document.getElementById('photoPreviewImg');
        if (preview && previewImg) {
            previewImg.src = photoData;
            preview.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
}

// Remove photo
function removePhoto() {
    const photoInput = document.getElementById('photo');
    const preview = document.getElementById('photoPreview');
    
    if (photoInput) {
        photoInput.value = '';
        photoInput.removeAttribute('data-photo');
    }
    
    if (preview) {
        preview.classList.add('hidden');
    }
}

function collectFormData() {
    const selectedTemplate = document.querySelector('input[name="template"]:checked')?.value || 'classic';
    const photoInput = document.getElementById('photo');
    const photoData = photoInput?.getAttribute('data-photo') || '';
    
    // Get page settings from localStorage if they exist, otherwise use null (templates will use defaults)
    let margin = null;
    let paperSize = null;
    let orientation = null;
    try {
        const existingData = localStorage.getItem('cvData');
        if (existingData) {
            const parsed = JSON.parse(existingData);
            if (parsed.margin && Array.isArray(parsed.margin) && parsed.margin.length === 4) {
                margin = parsed.margin;
            }
            if (parsed.paperSize) {
                paperSize = parsed.paperSize;
            }
            if (parsed.orientation) {
                orientation = parsed.orientation;
            }
        }
    } catch (e) {
        // Ignore errors, use null
    }
    
    const data = {
        template: selectedTemplate,
        name: document.getElementById('name').value,
        photo: photoData, // Store photo as base64 data URL
        title: document.getElementById('title')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        birthdate: document.getElementById('birthdate')?.value || '',
        cityOfBirth: document.getElementById('cityOfBirth')?.value || '',
        location: document.getElementById('location')?.value || '',
        website: document.getElementById('website').value,
        email: document.getElementById('email').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        dribbble: document.getElementById('dribbble')?.value || '',
        instagram: document.getElementById('instagram')?.value || '',
        about: document.getElementById('about')?.value || '',
        hobbies: document.getElementById('hobbies')?.value || '',
        education: [],
        experience: [],
        volunteer: [],
        publications: document.getElementById('publications').value,
        skills: document.getElementById('skills').value,
        languages: [],
        projects: [],
        awards: document.getElementById('awards').value
    };
    
    // Include page settings if they were previously set
    if (margin !== null) {
        data.margin = margin;
    }
    if (paperSize !== null) {
        data.paperSize = paperSize;
    }
    if (orientation !== null) {
        data.orientation = orientation;
    }
    
    // Collect education entries
    document.querySelectorAll('#educationContainer > div').forEach(entry => {
        const startDate = entry.querySelector('.edu-date-start')?.value || '';
        const endDate = entry.querySelector('.edu-date-end')?.value || '';
        data.education.push({
            university: entry.querySelector('.edu-university').value,
            city: entry.querySelector('.edu-city').value,
            degree: entry.querySelector('.edu-degree').value,
            gpa: entry.querySelector('.edu-gpa').value,
            dateStart: startDate,
            dateEnd: endDate,
            date: formatDateRange(startDate, endDate),
            thesis: entry.querySelector('.edu-thesis').value
        });
    });
    
    // Collect experience entries
    document.querySelectorAll('#experienceContainer > div').forEach(entry => {
        const startDate = entry.querySelector('.exp-date-start')?.value || '';
        const endDate = entry.querySelector('.exp-date-end')?.value || '';
        data.experience.push({
            company: entry.querySelector('.exp-company').value,
            city: entry.querySelector('.exp-city').value,
            position: entry.querySelector('.exp-position').value,
            dateStart: startDate,
            dateEnd: endDate,
            date: formatDateRange(startDate, endDate),
            description: entry.querySelector('.exp-description').value
        });
    });
    
    // Collect language entries
    document.querySelectorAll('#languagesContainer > div').forEach(entry => {
        data.languages.push({
            name: entry.querySelector('.lang-name').value,
            level: entry.querySelector('.lang-level').value
        });
    });
    
    // Collect project entries
    document.querySelectorAll('#projectsContainer > div').forEach(entry => {
        data.projects.push({
            title: entry.querySelector('.proj-title').value,
            tech: entry.querySelector('.proj-tech').value,
            description: entry.querySelector('.proj-description').value
        });
    });
    
    // Collect volunteer entries
    document.querySelectorAll('#volunteerContainer > div').forEach(entry => {
        const startDate = entry.querySelector('.vol-date-start')?.value || '';
        const endDate = entry.querySelector('.vol-date-end')?.value || '';
        data.volunteer.push({
            organization: entry.querySelector('.vol-organization').value,
            position: entry.querySelector('.vol-position').value,
            dateStart: startDate,
            dateEnd: endDate,
            date: formatDateRange(startDate, endDate),
            description: entry.querySelector('.vol-description').value
        });
    });
    
    return data;
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate contact info HTML
function generateContactInfo(data) {
    const parts = [];
    if (data.website && data.website.trim()) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        parts.push(`<a href="${url}">${escapeHtml(data.website)}</a>`);
    }
    if (data.email && data.email.trim()) {
        parts.push(`<a href="mailto:${data.email}">${escapeHtml(data.email)}</a>`);
    }
    if (data.linkedin && data.linkedin.trim()) {
        parts.push(`<a href="https://linkedin.com/in/${data.linkedin}">${escapeHtml(data.linkedin)}</a>`);
    }
    if (data.github && data.github.trim()) {
        const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
        parts.push(`<a href="${githubUrl}">${escapeHtml(data.github)}</a>`);
    }
    return parts.join(' <span>•</span> ');
}

// Format month input (YYYY-MM) to "Month Year" format
function formatMonthYear(monthInput) {
    if (!monthInput || !monthInput.trim()) {
        return null;
    }
    const [year, month] = monthInput.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} ${year}`;
}

// Format date range from two month inputs
function formatDateRange(startDate, endDate) {
    const start = formatMonthYear(startDate);
    const end = formatMonthYear(endDate);
    
    if (!start && !end) {
        return 'Present';
    }
    if (!start) {
        return end ? `Present - ${end}` : 'Present';
    }
    if (!end) {
        return `${start} - Present`;
    }
    return `${start} - ${end}`;
}

// Format date - show "Present" if empty (for backward compatibility)
function formatDate(date) {
    if (!date || !date.trim()) {
        return 'Present';
    }
    return date.trim();
}

// Template-specific header generation
function generateHeader(template, data) {
    const contactInfo = generateContactInfo(data);
    let headerClasses = '';
    let nameClasses = '';
    let contactClasses = '';
    
    switch(template) {
        case 'modern':
            headerClasses = 'text-left mb-6 print:mb-4 pb-4 print:pb-2 border-b-2 border-gray-300 print:border-gray-400';
            nameClasses = 'text-3xl font-bold mb-2 print:mb-1 print:text-2xl text-gray-900';
            contactClasses = 'text-sm print:text-xs text-gray-600 print:text-gray-800';
            break;
        case 'creative':
            headerClasses = 'text-center mb-6 print:mb-4 pb-4 print:pb-2 border-b-4 border-indigo-600 print:border-indigo-800 bg-indigo-50 print:bg-white p-4 print:p-2 rounded-lg print:rounded-none';
            nameClasses = 'text-3xl font-bold mb-2 print:mb-1 print:text-2xl text-indigo-900 print:text-black uppercase';
            contactClasses = 'text-sm print:text-xs text-indigo-700 print:text-gray-800 font-medium';
            break;
        default: // classic
            headerClasses = 'text-center mb-6 print:mb-4 pb-4 print:pb-2 border-b-2 border-gray-300 print:border-gray-400';
            nameClasses = 'text-3xl font-bold mb-2 print:mb-1 print:text-2xl';
            contactClasses = 'text-sm print:text-xs text-gray-600 print:text-gray-800';
    }
    
    let html = `<div class="${headerClasses}">`;
    // Add inline styles for classic template
    if (template === 'classic') {
        html += `<h1 class="${nameClasses}" style="font-family: Calibri, Arial, sans-serif; font-size: 20px;">${escapeHtml(data.name)}</h1>`;
        if (contactInfo) {
            html += `<div class="${contactClasses}" style="font-family: Calibri, Arial, sans-serif; font-size: 11px;">${contactInfo}</div>`;
        }
    } else {
        html += `<h1 class="${nameClasses}">${escapeHtml(data.name)}</h1>`;
        if (contactInfo) {
            html += `<div class="${contactClasses}">${contactInfo}</div>`;
        }
    }
    html += '</div>';
    return html;
}

// Template-specific section header generation
function generateSectionHeader(template, title) {
    let classes = '';
    switch(template) {
        case 'modern':
            classes = 'text-xl font-bold mb-3 print:mb-2 print:text-lg border-l-4 border-indigo-500 pl-3 print:pl-2 pb-1 uppercase';
            break;
        case 'creative':
            classes = 'text-xl font-bold mb-3 print:mb-2 print:text-lg bg-indigo-100 print:bg-white text-indigo-900 print:text-black px-3 print:px-0 py-2 print:py-1 rounded print:rounded-none uppercase';
            break;
        default: // classic
            classes = 'text-xl font-bold mb-3 print:mb-2 print:text-lg border-b-2 border-gray-300 pb-1 uppercase';
    }
    // Add inline styles for classic template
    if (template === 'classic') {
        return `<h2 class="${classes}" style="font-family: Calibri, Arial, sans-serif; font-size: 14px;">${title}</h2>`;
    }
    return `<h2 class="${classes}">${title}</h2>`;
}

// Generate education section HTML with template support
function generateEducation(entries, template = 'classic') {
    if (!entries || entries.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'EDUCATION')}`;
    
    entries.forEach(entry => {
        html += '<div class="mb-4 print:mb-3 print:break-inside-avoid">';
        // Add inline styles for classic template
        if (template === 'classic') {
            html += `<div class="font-bold text-lg print:text-base" style="font-family: Calibri, Arial, sans-serif; font-size: 14px;">${escapeHtml(entry.university)}</div>`;
            if (entry.city) {
                html += `<div class="text-gray-600 print:text-gray-800 text-sm" style="font-family: Calibri, Arial, sans-serif; font-size: 11px;">${escapeHtml(entry.city)}</div>`;
            }
            let degree = escapeHtml(entry.degree);
            if (entry.gpa) {
                degree += `, GPA: ${escapeHtml(entry.gpa)}`;
            }
            html += `<div class="italic text-gray-700 print:text-gray-900" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;">${degree}</div>`;
            const displayDate = formatDate(entry.date);
            html += `<div class="text-gray-600 print:text-gray-800 text-sm" style="font-family: Calibri, Arial, sans-serif; font-size: 11px;">${escapeHtml(displayDate)}</div>`;
            
            if (entry.thesis) {
                html += '<ul class="list-disc list-inside mt-2 print:mt-1 ml-4" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;"><li>Thesis: "' + escapeHtml(entry.thesis) + '"</li></ul>';
            }
        } else {
            html += `<div class="font-bold text-lg print:text-base">${escapeHtml(entry.university)}</div>`;
            if (entry.city) {
                html += `<div class="text-gray-600 print:text-gray-800 text-sm">${escapeHtml(entry.city)}</div>`;
            }
            let degree = escapeHtml(entry.degree);
            if (entry.gpa) {
                degree += `, GPA: ${escapeHtml(entry.gpa)}`;
            }
            html += `<div class="italic text-gray-700 print:text-gray-900">${degree}</div>`;
            const displayDate = formatDate(entry.date);
            html += `<div class="text-gray-600 print:text-gray-800 text-sm">${escapeHtml(displayDate)}</div>`;
            
            if (entry.thesis) {
                html += '<ul class="list-disc list-inside mt-2 print:mt-1 ml-4"><li>Thesis: "' + escapeHtml(entry.thesis) + '"</li></ul>';
            }
        }
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// Generate experience section HTML with template support
function generateExperience(entries, template = 'classic') {
    if (!entries || entries.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'EXPERIENCE')}`;
    
    entries.forEach(entry => {
        html += '<div class="mb-4 print:mb-3 print:break-inside-avoid">';
        // Add inline styles for classic template
        if (template === 'classic') {
            html += `<div class="font-bold text-lg print:text-base" style="font-family: Calibri, Arial, sans-serif; font-size: 14px;">${escapeHtml(entry.company)}</div>`;
            if (entry.city) {
                html += `<div class="text-gray-600 print:text-gray-800 text-sm" style="font-family: Calibri, Arial, sans-serif; font-size: 11px;">${escapeHtml(entry.city)}</div>`;
            }
            html += `<div class="italic text-gray-700 print:text-gray-900" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;">${escapeHtml(entry.position)}</div>`;
            const displayDate = formatDate(entry.date);
            html += `<div class="text-gray-600 print:text-gray-800 text-sm" style="font-family: Calibri, Arial, sans-serif; font-size: 11px;">${escapeHtml(displayDate)}</div>`;
            
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul class="list-disc list-inside mt-2 print:mt-1" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;">';
                    items.forEach(item => {
                        html += `<li>${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
        } else {
            html += `<div class="font-bold text-lg print:text-base">${escapeHtml(entry.company)}</div>`;
            if (entry.city) {
                html += `<div class="text-gray-600 print:text-gray-800 text-sm">${escapeHtml(entry.city)}</div>`;
            }
            html += `<div class="italic text-gray-700 print:text-gray-900">${escapeHtml(entry.position)}</div>`;
            const displayDate = formatDate(entry.date);
            html += `<div class="text-gray-600 print:text-gray-800 text-sm">${escapeHtml(displayDate)}</div>`;
            
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul class="list-disc list-inside mt-2 print:mt-1">';
                    items.forEach(item => {
                        html += `<li>${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
        }
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// Generate publications section HTML with template support
function generatePublications(text, template = 'classic') {
    if (!text || !text.trim()) return '';
    
    const publications = text.split('\n').filter(line => line.trim());
    if (publications.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'PUBLICATIONS')}`;
    html += '<div class="print:break-inside-avoid">';
    publications.forEach(pub => {
        if (template === 'classic') {
            html += `<div class="mb-2 print:mb-1 text-sm print:text-xs" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;">${escapeHtml(pub.trim())}.</div>`;
        } else {
            html += `<div class="mb-2 print:mb-1 text-sm print:text-xs">${escapeHtml(pub.trim())}.</div>`;
        }
    });
    html += '</div></div>';
    return html;
}

// Generate skills section HTML with template support
function generateSkills(text, template = 'classic') {
    if (!text || !text.trim()) return '';
    
    const skills = text.split('\n').filter(line => line.trim());
    if (skills.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'SKILLS')}`;
    html += '<ul class="list-disc list-inside ml-4 print:ml-3">';
    skills.forEach(skill => {
        if (template === 'classic') {
            html += `<li class="mb-1 print:mb-0.5" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;"><strong>${escapeHtml(skill.trim())}</strong></li>`;
        } else {
            html += `<li class="mb-1 print:mb-0.5"><strong>${escapeHtml(skill.trim())}</strong></li>`;
        }
    });
    html += '</ul></div>';
    return html;
}

// Generate languages section HTML with template support
function generateLanguages(entries, template = 'classic') {
    if (!entries || entries.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'LANGUAGES')}`;
    html += '<ul class="list-disc list-inside ml-4 print:ml-3">';
    entries.forEach(entry => {
        if (template === 'classic') {
            let line = `<li class="mb-1 print:mb-0.5" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;"><strong>${escapeHtml(entry.name)}:</strong>`;
            if (entry.level) {
                line += ` ${escapeHtml(entry.level)}`;
            }
            line += '</li>';
            html += line;
        } else {
            let line = `<li class="mb-1 print:mb-0.5"><strong>${escapeHtml(entry.name)}:</strong>`;
            if (entry.level) {
                line += ` ${escapeHtml(entry.level)}`;
            }
            line += '</li>';
            html += line;
        }
    });
    html += '</ul></div>';
    return html;
}

// Generate projects section HTML with template support
function generateProjects(entries, template = 'classic') {
    if (!entries || entries.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'PROJECTS')}`;
    entries.forEach(entry => {
        html += '<div class="mb-4 print:mb-3 print:break-inside-avoid">';
        if (template === 'classic') {
            let title = `<div class="font-bold text-lg print:text-base" style="font-family: Calibri, Arial, sans-serif; font-size: 14px;">${escapeHtml(entry.title)}</div>`;
            if (entry.tech) {
                title = `<div class="font-bold text-lg print:text-base" style="font-family: Calibri, Arial, sans-serif; font-size: 14px;">${escapeHtml(entry.title)} (${escapeHtml(entry.tech)})</div>`;
            }
            html += title;
            
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul class="list-disc list-inside mt-2 print:mt-1 ml-4" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;">';
                    items.forEach(item => {
                        html += `<li>${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
        } else {
            let title = `<div class="font-bold text-lg print:text-base">${escapeHtml(entry.title)}</div>`;
            if (entry.tech) {
                title = `<div class="font-bold text-lg print:text-base">${escapeHtml(entry.title)} (${escapeHtml(entry.tech)})</div>`;
            }
            html += title;
            
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul class="list-disc list-inside mt-2 print:mt-1 ml-4">';
                    items.forEach(item => {
                        html += `<li>${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
        }
        html += '</div>';
    });
    html += '</div>';
    return html;
}

// Generate awards section HTML with template support
function generateAwards(text, template = 'classic') {
    if (!text || !text.trim()) return '';
    
    const awards = text.split('\n').filter(line => line.trim());
    if (awards.length === 0) return '';
    
    let html = `<div class="mb-6 print:mb-4 print:break-inside-avoid">${generateSectionHeader(template, 'SCHOLARSHIPS AND AWARDS')}`;
    html += '<ul class="list-disc list-inside ml-4 print:ml-3">';
    awards.forEach(award => {
        // Split by dots pattern, escape each part, then join with dots
        const parts = award.trim().split(/\.\.\.\.\./);
        if (template === 'classic') {
            if (parts.length === 2) {
                // Award name and date - use flex layout
                html += `<li class="mb-1 print:mb-0.5 flex justify-between" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;"><span>${escapeHtml(parts[0].trim())}</span><span>${escapeHtml(parts[1].trim())}</span></li>`;
            } else {
                // No dots pattern, just display as is
                html += `<li class="mb-1 print:mb-0.5" style="font-family: Calibri, Arial, sans-serif; font-size: 12px;">${escapeHtml(award.trim())}</li>`;
            }
        } else {
            if (parts.length === 2) {
                // Award name and date - use flex layout
                html += `<li class="mb-1 print:mb-0.5 flex justify-between"><span>${escapeHtml(parts[0].trim())}</span><span>${escapeHtml(parts[1].trim())}</span></li>`;
            } else {
                // No dots pattern, just display as is
                html += `<li class="mb-1 print:mb-0.5">${escapeHtml(award.trim())}</li>`;
            }
        }
    });
    html += '</ul></div>';
    return html;
}

// Generate complete CV HTML
function generateCV() {
    const data = collectFormData();
    return generateCVFromData(data);
}

// Generate CV from data object (for use with localStorage)
function generateCVFromData(data) {
    const template = data.template || 'classic';
    
    // Special handling for luxsleek template (two-column layout)
    if (template === 'luxsleek') {
        return generateLuxSleekCV(data);
    }
    
    // Special handling for classic template (Northeastern University COS format)
    if (template === 'classic') {
        return generateClassicNUCV(data);
    }
    
    // Special handling for minimal template (two-column minimalist layout)
    if (template === 'minimal') {
        return generateMinimalCV(data);
    }
    
    // Special handling for nabhel template (two-column product designer layout)
    if (template === 'nabhel') {
        return generateProductDesignerCV(data);
    }
    
    // Special handling for yodi template (UX/UI Designer layout)
    if (template === 'yodi') {
        return generateUXUIDesignerCV(data);
    }
    
    // Special handling for modern template (single column clean layout)
    if (template === 'modern') {
        return generateModernCV(data);
    }
    
    let html = generateHeader(template, data);
    
    html += generateEducation(data.education, template);
    html += generateExperience(data.experience, template);
    html += generatePublications(data.publications, template);
    html += generateSkills(data.skills, template);
    html += generateLanguages(data.languages, template);
    html += generateProjects(data.projects, template);
    html += generateAwards(data.awards, template);
    
    return html;
}

// Generate LuxSleek CV with two-column layout
function generateLuxSleekCV(data) {
    const luxsleekBlue = '#304263';
    
    // Left column content (blue sidebar) - using flexbox layout
    // Use fixed height for PDF (11in = letter size height) and 100vh for screen
    let leftColumn = '<div id="luxsleek-left-column" style="flex: 0 0 33%; min-height: 100vh; /* height: 279.4mm; */ box-sizing: border-box; background-color: #304263; background: #304263; color: white; padding: 24px; font-family: Calibri, Arial, sans-serif; font-size: 12px; position: relative; visibility: visible; opacity: 1;">';
    
    // Name
    const nameParts = data.name.split(' ');
    const lastName = nameParts.pop() || '';
    const firstName = nameParts.join(' ');
    leftColumn += `<div style="margin-bottom: 16px;"><h1 style="font-size: 18px; font-weight: bold; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">${escapeHtml(firstName)} <span>${escapeHtml(lastName)}</span></h1></div>`;
    
    // Job Title
    if (data.title && data.title.trim()) {
        leftColumn += `<div style="font-size: 12px; margin-bottom: 16px; font-family: Calibri, Arial, sans-serif;">${escapeHtml(data.title)}</div>`;
    }
    
    // Profile Image (only if present) - placed under role
    if (data.photo && data.photo.trim()) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        // Portrait format container (210px width x 300px height = 3:4.3 ratio)
        leftColumn += '<div style="width: 100%; max-width: 210px; height: 300px; overflow: hidden; background-color: rgba(255,255,255,0.1); position: relative;">';
        // Don't escape the photo data URL - it's already a valid data URL
        leftColumn += `<img src="${data.photo}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; position: absolute; top: 0; left: 0;">`;
        leftColumn += '</div></div>';
    }
    
    // Profile/About section
    if (data.about && data.about.trim()) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += '<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.3); font-family: Calibri, Arial, sans-serif;">Profile</h2>';
        leftColumn += `<p style="font-size: 12px; line-height: 1.6; font-family: Calibri, Arial, sans-serif;">${escapeHtml(data.about).replace(/\n/g, '<br>')}</p>`;
        leftColumn += '</div>';
    }
    
    // Contact details
    leftColumn += '<div style="margin-bottom: 24px;">';
    leftColumn += '<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.3); font-family: Calibri, Arial, sans-serif;">Contact Details</h2>';
    leftColumn += '<div style="font-size: 12px; font-family: Calibri, Arial, sans-serif;">';
    if (data.email) {
        leftColumn += `<div style="margin-bottom: 4px;"><a href="mailto:${escapeHtml(data.email)}" style="color: white; text-decoration: none;">${escapeHtml(data.email)}</a></div>`;
    }
    if (data.phone) {
        leftColumn += `<div style="margin-bottom: 4px;">${escapeHtml(data.phone)}</div>`;
    }
    if (data.website) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        leftColumn += `<div style="margin-bottom: 4px;"><a href="${url}" style="color: white; text-decoration: none;">${escapeHtml(data.website)}</a></div>`;
    }
    if (data.linkedin) {
        leftColumn += `<div style="margin-bottom: 4px;"><a href="https://linkedin.com/in/${data.linkedin}" style="color: white; text-decoration: none;">${escapeHtml(data.linkedin)}</a></div>`;
    }
    if (data.github) {
        const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
        leftColumn += `<div style="margin-bottom: 4px;"><a href="${githubUrl}" style="color: white; text-decoration: none;">${escapeHtml(data.github)}</a></div>`;
    }
    if (data.dribbble) {
        const dribbbleUrl = data.dribbble.startsWith('http') ? data.dribbble : `https://${data.dribbble}`;
        leftColumn += `<div style="margin-bottom: 4px;"><a href="${dribbbleUrl}" style="color: white; text-decoration: none;">${escapeHtml(data.dribbble)}</a></div>`;
    }
    if (data.instagram) {
        const instagramUrl = data.instagram.startsWith('http') ? data.instagram : `https://${data.instagram}`;
        leftColumn += `<div style="margin-bottom: 4px;"><a href="${instagramUrl}" style="color: white; text-decoration: none;">${escapeHtml(data.instagram)}</a></div>`;
    }
    if (data.location) {
        leftColumn += `<div style="margin-bottom: 4px;">${escapeHtml(data.location)}</div>`;
    }
    leftColumn += '</div></div>';
    
    // Personal Information
    leftColumn += '<div style="margin-bottom: 24px;">';
    leftColumn += '<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.3); font-family: Calibri, Arial, sans-serif;">Personal Information</h2>';
    leftColumn += '<div style="font-size: 12px; font-family: Calibri, Arial, sans-serif;">';
    if (data.birthdate) {
        const birthYear = data.birthdate.split('-')[0];
        const cityText = data.cityOfBirth ? `, ${escapeHtml(data.cityOfBirth)}` : '';
        leftColumn += `<div style="margin-bottom: 4px;">Year of birth: <strong>${escapeHtml(birthYear)}${cityText}</strong></div>`;
    } else if (data.cityOfBirth) {
        leftColumn += `<div style="margin-bottom: 4px;">City of birth: <strong>${escapeHtml(data.cityOfBirth)}</strong></div>`;
    }
    if (data.languages && data.languages.length > 0) {
        const langList = data.languages.map(l => `<strong>${escapeHtml(l.name)}</strong>${l.level ? ` (${escapeHtml(l.level)})` : ''}`).join(', ');
        leftColumn += `<div style="margin-bottom: 4px;">Languages: ${langList}</div>`;
    }
    leftColumn += '</div></div>';
    
    // Skills
    if (data.skills && data.skills.trim()) {
        leftColumn += '<div style="margin-top: 24px; margin-bottom: 24px;">';
        leftColumn += '<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.3); font-family: Calibri, Arial, sans-serif;">Skills</h2>';
        leftColumn += '<ul style="font-size: 12px; list-style: none; padding-left: 0; margin: 0; font-family: Calibri, Arial, sans-serif;">';
        data.skills.split('\n').filter(line => line.trim()).forEach(skill => {
            leftColumn += `<li style="margin-bottom: 4px;">• ${escapeHtml(skill.trim())}</li>`;
        });
        leftColumn += '</ul></div>';
    }
    
    leftColumn += '</div>';
    
    // Right column content (white area) - using flexbox layout
    let rightColumn = '<div id="luxsleek-right-column" style="flex: 0 0 67%; box-sizing: border-box; background-color: white; color: black; padding: 24px; font-family: Calibri, Arial, sans-serif; font-size: 12px; position: relative; visibility: visible; opacity: 1;">';
    
    // Track if this is the first section
    let isFirstSection = true;
    
    // Experience
    if (data.experience && data.experience.length > 0) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Experience</h2>';
        isFirstSection = false;
        data.experience.forEach(entry => {
            rightColumn += '<div style="margin-bottom: 16px;">';
            const dateStr = formatDateForLuxSleek(entry.dateStart, entry.dateEnd);
            rightColumn += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">`;
            rightColumn += `<div style="flex: 1; font-size: 12px;"><div style="font-weight: bold; text-transform: uppercase;">${escapeHtml(entry.position)}</div><div style="font-size: 11px;">${escapeHtml(entry.company)}${entry.city ? ` (${escapeHtml(entry.city)})` : ''}</div></div>`;
            rightColumn += `<div style="text-align: right; margin-left: 16px; white-space: nowrap; font-size: 12px;">${dateStr}</div>`;
            rightColumn += `</div>`;
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    rightColumn += '<div style="font-size: 11px; color: #666; margin-top: 4px; font-family: Calibri, Arial, sans-serif;">';
                    items.forEach(item => {
                        rightColumn += `<div style="margin-bottom: 2px;">${escapeHtml(item.trim())}</div>`;
                    });
                    rightColumn += '</div>';
                }
            }
            rightColumn += '</div>';
        });
        rightColumn += '</div>';
    }
    
    // Education
    if (data.education && data.education.length > 0) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Education</h2>';
        isFirstSection = false;
        data.education.forEach(entry => {
            rightColumn += '<div style="margin-bottom: 16px;">';
            const dateStr = formatDateForLuxSleek(entry.dateStart, entry.dateEnd);
            rightColumn += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">`;
            rightColumn += `<div style="flex: 1; font-size: 12px;"><span style="font-weight: bold; text-transform: uppercase;">${escapeHtml(entry.degree)}</span>. <em>${escapeHtml(entry.university)}${entry.city ? ` (${escapeHtml(entry.city)})` : ''}</em>${entry.gpa ? ` - GPA: ${escapeHtml(entry.gpa)}` : ''}.</div>`;
            rightColumn += `<div style="text-align: right; margin-left: 16px; white-space: nowrap; font-size: 12px;">${dateStr}</div>`;
            rightColumn += `</div>`;
            if (entry.thesis) {
                rightColumn += `<div style="font-size: 11px; color: #666; margin-top: 4px; font-family: Calibri, Arial, sans-serif;">Thesis: <em>${escapeHtml(entry.thesis)}</em></div>`;
            }
            rightColumn += '</div>';
        });
        rightColumn += '</div>';
    }
    
    // Projects (as Additional Education/Projects)
    if (data.projects && data.projects.length > 0) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Projects</h2>';
        isFirstSection = false;
        data.projects.forEach(entry => {
            rightColumn += '<div style="margin-bottom: 16px;">';
            rightColumn += `<div style="font-size: 12px; font-family: Calibri, Arial, sans-serif;"><span style="font-weight: bold; text-transform: uppercase;">${escapeHtml(entry.title)}</span>${entry.tech ? ` (${escapeHtml(entry.tech)})` : ''}.</div>`;
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    rightColumn += '<div style="font-size: 11px; color: #666; margin-top: 4px; font-family: Calibri, Arial, sans-serif;">';
                    items.forEach(item => {
                        rightColumn += `<div style="margin-bottom: 2px;">${escapeHtml(item.trim())}</div>`;
                    });
                    rightColumn += '</div>';
                }
            }
            rightColumn += '</div>';
        });
        rightColumn += '</div>';
    }
    
    // Volunteer
    if (data.volunteer && data.volunteer.length > 0) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Volunteer</h2>';
        isFirstSection = false;
        data.volunteer.forEach(entry => {
            rightColumn += '<div style="margin-bottom: 16px;">';
            const dateStr = formatDateForLuxSleek(entry.dateStart, entry.dateEnd);
            rightColumn += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">`;
            rightColumn += `<div style="flex: 1; font-size: 12px;"><div style="font-weight: bold; text-transform: uppercase;">${escapeHtml(entry.position)}</div><div style="font-size: 11px;">${escapeHtml(entry.organization)}</div></div>`;
            rightColumn += `<div style="text-align: right; margin-left: 16px; white-space: nowrap; font-size: 12px;">${dateStr}</div>`;
            rightColumn += `</div>`;
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    rightColumn += '<div style="font-size: 11px; color: #666; margin-top: 4px; font-family: Calibri, Arial, sans-serif;">';
                    items.forEach(item => {
                        rightColumn += `<div style="margin-bottom: 2px;">${escapeHtml(item.trim())}</div>`;
                    });
                    rightColumn += '</div>';
                }
            }
            rightColumn += '</div>';
        });
        rightColumn += '</div>';
    }
    
    // Publications
    if (data.publications && data.publications.trim()) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Publications</h2>';
        isFirstSection = false;
        const publications = data.publications.split('\n').filter(line => line.trim());
        publications.forEach(pub => {
            rightColumn += `<div style="font-size: 11px; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">${escapeHtml(pub.trim())}</div>`;
        });
        rightColumn += '</div>';
    }
    
    // Awards
    if (data.awards && data.awards.trim()) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Awards</h2>';
        isFirstSection = false;
        const awards = data.awards.split('\n').filter(line => line.trim());
        awards.forEach(award => {
            rightColumn += `<div style="font-size: 11px; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">${escapeHtml(award.trim())}</div>`;
        });
        rightColumn += '</div>';
    }
    
    // Hobbies
    if (data.hobbies && data.hobbies.trim()) {
        rightColumn += `<div style="${isFirstSection ? 'margin-bottom: 24px;' : 'margin-top: 24px; margin-bottom: 24px;'}">`;
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Hobbies</h2>';
        isFirstSection = false;
        const hobbies = data.hobbies.split('\n').filter(line => line.trim());
        hobbies.forEach(hobby => {
            rightColumn += `<div style="font-size: 11px; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;"><em>${escapeHtml(hobby.trim())}</em></div>`;
        });
        rightColumn += '</div>';
    }
    
    rightColumn += '</div>';
    
    // Combine into two-column layout using flexbox
    return `<div id="luxsleek-wrapper" style="width: 100%; margin: 0; padding: 0; display: flex; min-height: 100vh; font-family: Calibri, Arial, sans-serif; font-size: 12px;">${leftColumn}${rightColumn}</div>`;
}

// Format date for LuxSleek template (YYYY.MM--YYYY.MM format)
function formatDateForLuxSleek(startDate, endDate) {
    if (!startDate && !endDate) return '';
    
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month] = dateStr.split('-');
        return `${month || '01'}/${year}`;
    };
    
    const start = formatDate(startDate);
    let end = '';

    if (startDate && startDate != ""){
        end = endDate ? formatDate(endDate) : 'Present';
    }
    
    if (!start) return end;
    return `${start} - ${end}`;
}

// Generate Classic CV - ATS-Friendly Version
// Optimized for Applicant Tracking Systems with standard formatting and section names
function generateClassicNUCV(data) {
    let html = '';
    const baseStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 12px; line-height: 1.5;';
    const headerStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 20px; font-weight: bold;';
    const sectionStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 0.5px;';
    const sectionHeaderStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; margin-top: 0; text-transform: uppercase;';
    const entryTitleStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 13px; font-weight: bold;';
    
    // Header - Name and Title only (ATS-friendly, no "Curriculum Vitae" text)
    html += '<div class="text-center mb-4 print:mb-3" style="' + baseStyle + '">';
    html += `<h1 style="${headerStyle} margin-bottom: 4px;">${escapeHtml(data.name)}</h1>`;
    if (data.title && data.title.trim()) {
        html += `<div style="${baseStyle} font-size: 13px; margin-bottom: 8px;">${escapeHtml(data.title)}</div>`;
    }
    
    // Contact info - single line, standard format
    const contactParts = [];
    if (data.email) contactParts.push(escapeHtml(data.email));
    if (data.phone) contactParts.push(escapeHtml(data.phone));
    if (data.location) contactParts.push(escapeHtml(data.location));
    if (data.website) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        contactParts.push(escapeHtml(data.website.replace(/^https?:\/\//, '')));
    }
    if (data.linkedin) {
        contactParts.push(`LinkedIn: ${escapeHtml(data.linkedin)}`);
    }
    
    if (contactParts.length > 0) {
        html += `<div style="${baseStyle} font-size: 11px; margin-top: 4px;">${contactParts.join(' | ')}</div>`;
    }
    html += '</div>';
    
    // Professional Summary / About section (ATS keyword-rich)
    if (data.about && data.about.trim()) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">PROFESSIONAL SUMMARY</h2>`;
        html += `<div style="${baseStyle}">${escapeHtml(data.about).replace(/\n/g, '<br>')}</div>`;
        html += '</div>';
    }
    
    // PROFESSIONAL EXPERIENCE - Separate section (ATS standard)
    if (data.experience && data.experience.length > 0) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">PROFESSIONAL EXPERIENCE</h2>`;
        
        data.experience.forEach(entry => {
            html += '<div class="mb-3 print:mb-2" style="margin-bottom: 14px;">';
            
            // Position and Company on same line
            html += `<div style="${entryTitleStyle} margin-bottom: 2px;">${escapeHtml(entry.position)}</div>`;
            html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(entry.company)}${entry.city ? `, ${escapeHtml(entry.city)}` : ''}</div>`;
            
            // Date range - standard format
            const dateRange = formatDateForATS(entry.dateStart, entry.dateEnd);
            html += `<div style="${baseStyle} font-style: italic; margin-bottom: 4px;">${escapeHtml(dateRange)}</div>`;
            
            // Description with bullet points
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul style="margin: 4px 0 0 0; padding-left: 20px; list-style-type: disc;">';
                    items.forEach(item => {
                        html += `<li style="${baseStyle} margin-bottom: 2px;">${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // EDUCATION - Separate section (ATS standard)
    if (data.education && data.education.length > 0) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">EDUCATION</h2>`;
        
        data.education.forEach(entry => {
            html += '<div class="mb-3 print:mb-2" style="margin-bottom: 14px;">';
            html += `<div style="${entryTitleStyle} margin-bottom: 2px;">${escapeHtml(entry.degree)}</div>`;
            html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(entry.university)}${entry.city ? `, ${escapeHtml(entry.city)}` : ''}</div>`;
            
            // Date range - standard format
            const dateRange = formatDateForATSEducation(entry.dateStart, entry.dateEnd);
            if (dateRange) {
                html += `<div style="${baseStyle} font-style: italic; margin-bottom: 2px;">${escapeHtml(dateRange)}</div>`;
            }
            
            if (entry.gpa) {
                html += `<div style="${baseStyle}">GPA: ${escapeHtml(entry.gpa)}</div>`;
            }
            if (entry.thesis) {
                html += `<div style="${baseStyle} margin-top: 2px;">Thesis: ${escapeHtml(entry.thesis)}</div>`;
            }
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // SKILLS - Standard ATS section name
    if (data.skills && data.skills.trim()) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">SKILLS</h2>`;
        
        const skills = data.skills.split('\n').filter(line => line.trim());
        html += '<div style="margin-left: 0;">';
        skills.forEach(skill => {
            html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(skill.trim())}</div>`;
        });
        html += '</div></div>';
    }
    
    // PROJECTS - Standard section
    if (data.projects && data.projects.length > 0) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">PROJECTS</h2>`;
        
        data.projects.forEach(entry => {
            html += '<div class="mb-3 print:mb-2" style="margin-bottom: 12px;">';
            html += `<div style="${entryTitleStyle} margin-bottom: 2px;">${escapeHtml(entry.title)}</div>`;
            if (entry.tech) {
                html += `<div style="${baseStyle} margin-bottom: 2px;">Technologies: ${escapeHtml(entry.tech)}</div>`;
            }
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul style="margin: 4px 0 0 0; padding-left: 20px; list-style-type: disc;">';
                    items.forEach(item => {
                        html += `<li style="${baseStyle} margin-bottom: 2px;">${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
            html += '</div>';
        });
        html += '</div>';
    }
    
    // CERTIFICATIONS - Standard ATS section name
    if (data.awards && data.awards.trim()) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">CERTIFICATIONS</h2>`;
        
        const awards = data.awards.split('\n').filter(line => line.trim());
        html += '<div style="margin-left: 0;">';
        awards.forEach(award => {
            html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(award.trim())}</div>`;
        });
        html += '</div></div>';
    }
    
    // LANGUAGES - Standard section
    if (data.languages && data.languages.length > 0) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">LANGUAGES</h2>`;
        
        html += '<div style="margin-left: 0;">';
        data.languages.forEach(entry => {
            let langText = escapeHtml(entry.name);
            if (entry.level) {
                langText += ` - ${escapeHtml(entry.level)}`;
            }
            html += `<div style="${baseStyle} margin-bottom: 2px;">${langText}</div>`;
        });
        html += '</div></div>';
    }
    
    // VOLUNTEER EXPERIENCE - Standard section
    if (data.volunteer && data.volunteer.length > 0) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">VOLUNTEER EXPERIENCE</h2>`;
        
        data.volunteer.forEach(entry => {
            html += '<div class="mb-3 print:mb-2" style="margin-bottom: 14px;">';
            html += `<div style="${entryTitleStyle} margin-bottom: 2px;">${escapeHtml(entry.position)}</div>`;
            html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(entry.organization)}${entry.city ? `, ${escapeHtml(entry.city)}` : ''}</div>`;
            
            // Date range
            const dateRange = formatDateForATS(entry.dateStart, entry.dateEnd);
            html += `<div style="${baseStyle} font-style: italic; margin-bottom: 4px;">${escapeHtml(dateRange)}</div>`;
            
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<ul style="margin: 4px 0 0 0; padding-left: 20px; list-style-type: disc;">';
                    items.forEach(item => {
                        html += `<li style="${baseStyle} margin-bottom: 2px;">${escapeHtml(item.trim())}</li>`;
                    });
                    html += '</ul>';
                }
            }
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // PUBLICATIONS - Optional section
    if (data.publications && data.publications.trim()) {
        html += `<div class="mb-4 print:mb-3 print:break-inside-avoid" style="margin-bottom: 20px;">`;
        html += `<h2 style="${sectionHeaderStyle}">PUBLICATIONS</h2>`;
        
        const publications = data.publications.split('\n').filter(line => line.trim());
        html += '<div style="margin-left: 0;">';
        publications.forEach(pub => {
            html += `<div style="${baseStyle} margin-bottom: 4px;">${escapeHtml(pub.trim())}</div>`;
        });
        html += '</div></div>';
    }
    
    return html;
}

// Generate Modern CV - Single column clean layout
// Based on Figma design: https://www.figma.com/design/qCi2244ZLEUvwuUnPbHuCk/6-Free-Resume-Templates--Community-?node-id=135-14
function generateModernCV(data) {
    const fontFamily = "'Poppins', 'Arial', sans-serif";
    const baseStyle = `font-family: ${fontFamily}; font-size: 8px; line-height: 12px; color: #222;`;
    const nameStyle = `font-family: ${fontFamily}; font-size: 16px; font-weight: 600; line-height: 24px; color: #222;`;
    const titleStyle = `font-family: ${fontFamily}; font-size: 10px; font-weight: 500; line-height: 16px; color: #222;`;
    const sectionHeaderStyle = `font-family: ${fontFamily}; font-size: 10px; font-weight: 600; line-height: 16px; color: #222;`;
    const jobTitleStyle = `font-family: ${fontFamily}; font-size: 10px; font-weight: 400; line-height: 16px; color: #222;`;
    const companyStyle = `font-family: ${fontFamily}; font-size: 10px; font-weight: 600; line-height: 16px; color: #222;`;
    const dateStyle = `font-family: ${fontFamily}; font-size: 9px; font-weight: 500; line-height: 12px; color: #797979;`;
    const contactStyle = `font-family: ${fontFamily}; font-size: 8px; font-weight: 500; line-height: 12px; color: #222; text-decoration: underline;`;
    
    let html = `<div style="font-family: ${fontFamily}; width: 100%; box-sizing: border-box; background: white; position: relative; max-width: 600px; margin: 0 auto;">`;
    
    // Header Section - Name and Title on left, Contact on right
    html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; position: relative;">';
    html += '<div style="flex: 0 0 136px;">';
    html += `<div style="${nameStyle} margin-bottom: 2px;">${escapeHtml(data.name)}</div>`;
    if (data.title && data.title.trim()) {
        html += `<div style="${titleStyle} margin-top: 2px;">${escapeHtml(data.title)}</div>`;
    }
    html += '</div>';
    
    // Contact information - positioned to the right side
    html += '<div style="text-align: right; flex-shrink: 0;">';
    if (data.email) {
        html += `<a href="mailto:${escapeHtml(data.email)}" style="${contactStyle} display: block; margin-bottom: 4px; color: #222; text-decoration: underline;">${escapeHtml(data.email)}</a>`;
    }
    if (data.linkedin) {
        const linkedinUrl = data.linkedin.startsWith('http') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`;
        const linkedinText = data.linkedin.startsWith('http') ? data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '') : data.linkedin;
        html += `<a href="${linkedinUrl}" style="${contactStyle} display: block; margin-bottom: 4px; color: #222; text-decoration: underline;">linkedin.com/in/${escapeHtml(linkedinText)}</a>`;
    }
    if (data.phone) {
        html += `<a href="tel:${escapeHtml(data.phone)}" style="${contactStyle} display: block; color: #222; text-decoration: underline;">${escapeHtml(data.phone)}</a>`;
    }
    html += '</div>';
    html += '</div>';
    
    // Professional Summary
    if (data.about && data.about.trim()) {
        html += `<div style="margin-bottom: 20px;">`;
        html += `<div style="${baseStyle} line-height: 12px; white-space: pre-wrap;">${escapeHtml(data.about)}</div>`;
        html += '</div>';
    }
    
    // Experience Section
    if (data.experience && data.experience.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += `<div style="${sectionHeaderStyle} margin-bottom: 12px;">Experience</div>`;
        
        data.experience.forEach(entry => {
            html += '<div style="display: flex; margin-bottom: 20px; position: relative;">';
            
            // Left column - Job title, company, dates
            html += '<div style="flex: 0 0 136px; margin-right: 32px;">';
            html += `<div style="${jobTitleStyle} margin-bottom: 2px;">${escapeHtml(entry.position)}</div>`;
            html += `<div style="${companyStyle} margin-bottom: 2px;">${escapeHtml(entry.company)}</div>`;
            
            const dateRange = formatDateForATS(entry.dateStart, entry.dateEnd);
            html += `<div style="${dateStyle} margin-bottom: 8px;">${escapeHtml(dateRange)}</div>`;
            html += '</div>';
            
            // Right column - Description
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                if (items.length > 0) {
                    html += '<div style="flex: 1;">';
                    items.forEach((item, itemIndex) => {
                        html += `<p style="${baseStyle} margin: 0; margin-bottom: ${itemIndex < items.length - 1 ? '4px' : '0'}; white-space: pre-wrap;">${escapeHtml(item.trim())}</p>`;
                    });
                    html += '</div>';
                }
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // Education Section
    if (data.education && data.education.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += `<div style="${sectionHeaderStyle} margin-bottom: 12px;">Education</div>`;
        
        data.education.forEach(entry => {
            html += '<div style="display: flex; margin-bottom: 16px;">';
            
            // Left column - Section label (empty for education)
            html += '<div style="flex: 0 0 136px; margin-right: 32px;"></div>';
            
            // Right column - University, degree, dates
            html += '<div style="flex: 1;">';
            html += `<div style="${companyStyle} margin-bottom: 2px;">${escapeHtml(entry.university)}</div>`;
            html += `<div style="${jobTitleStyle} margin-bottom: 2px;">${escapeHtml(entry.degree)}</div>`;
            
            const dateRange = formatDateForATSEducation(entry.dateStart, entry.dateEnd);
            if (dateRange) {
                html += `<div style="${dateStyle}">${escapeHtml(dateRange)}</div>`;
            }
            html += '</div>';
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // Skills Section - 3 columns, aligned like Education
    if (data.skills && data.skills.trim()) {
        html += '<div style="margin-bottom: 20px;">';
        html += `<div style="${sectionHeaderStyle} margin-bottom: 12px;">Skills</div>`;
        
        html += '<div style="display: flex; margin-bottom: 16px;">';
        
        // Left column - Section label (empty for skills, matching Education)
        html += '<div style="flex: 0 0 136px; margin-right: 32px;"></div>';
        
        // Right column - Skills content in 3 columns
        html += '<div style="flex: 1; display: flex; gap: 16px;">';
        
        const skills = data.skills.split('\n').filter(line => line.trim());
        const skillsPerColumn = Math.ceil(skills.length / 3);
        const column1 = skills.slice(0, skillsPerColumn);
        const column2 = skills.slice(skillsPerColumn, skillsPerColumn * 2);
        const column3 = skills.slice(skillsPerColumn * 2);
        
        // Column 1
        html += '<div style="width: 120px;">';
        column1.forEach(skill => {
            html += `<p style="${baseStyle} margin: 0; margin-bottom: 4px; white-space: pre-wrap;">${escapeHtml(skill.trim())}</p>`;
        });
        html += '</div>';
        
        // Column 2
        html += '<div style="width: 120px;">';
        column2.forEach(skill => {
            html += `<p style="${baseStyle} margin: 0; margin-bottom: 4px; white-space: pre-wrap;">${escapeHtml(skill.trim())}</p>`;
        });
        html += '</div>';
        
        // Column 3
        html += '<div style="width: 120px;">';
        column3.forEach(skill => {
            html += `<p style="${baseStyle} margin: 0; margin-bottom: 4px; white-space: pre-wrap;">${escapeHtml(skill.trim())}</p>`;
        });
        html += '</div>';
        
        html += '</div>'; // End right column
        html += '</div>'; // End flex container
        html += '</div>'; // End section
    }
    
    html += '</div>';
    return html;
}

// Generate Product Designer CV - Two-column product designer layout
// Based on Figma design: https://www.figma.com/design/sOYN6lK8xpQkALwzTzNiV7/Resume-Template-for-Product-Designers--UX-UI---Community-
function generateProductDesignerCV(data) {
    const fontFamily = "'DM Sans', 'Inter', 'Arial', sans-serif";
    const interFont = "'Inter', 'Arial', sans-serif";
    
    // Color scheme from Figma
    const colors = {
        dark: '#2E2E48',
        medium: '#47516B',
        light: '#79819A',
        lightest: '#E2E6EE',
        sidebarBg: '#F5F7FA',
        dribbble: '#EA4C89',
        linkedin: '#0077B5'
    };
    
    // Font sizes (12px base, adjusted for hierarchy)
    const nameSize = '20px';
    const titleSize = '14px';
    const sectionHeaderSize = '14px';
    const bodySize = '12px';
    const smallSize = '11px';
    const captionSize = '10px';
    
    // Start two-column layout using flexbox
    let html = '<div style="display: flex; width: 100%; font-family: ' + fontFamily + ';">';
    
    // LEFT COLUMN (~25% width) - Sidebar
    let leftColumn = '<div id="nabhel-left-column" style="flex: 0 0 25%; padding: 24px 24px 0 0; box-sizing: border-box;">';
    
    // Profile Picture (show if available, hide completely if not)
    if (data.photo && data.photo.trim()) {
        leftColumn += '<div style="width: 48px; height: 48px; border-radius: 50%; margin-bottom: 10px; overflow: hidden; background-color: ' + colors.lightest + ';">';
        // Don't escape the photo data URL - it's already a valid data URL
        leftColumn += `<img src="${data.photo}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
        leftColumn += '</div>';
    }
    // If no photo, don't add the placeholder div at all
    
    // Name
    leftColumn += '<div style="margin-bottom: 4px;">';
    leftColumn += `<h1 style="font-family: ${interFont}; font-size: ${nameSize}; font-weight: 500; color: ${colors.dark}; margin: 0; line-height: 20px;">${escapeHtml(data.name)}</h1>`;
    leftColumn += '</div>';
    
    // Job Title
    if (data.title && data.title.trim()) {
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${titleSize}; font-weight: 500; color: #333333; margin-bottom: 10px; line-height: 16px;">${escapeHtml(data.title)}</div>`;
    }
    
    // Divider
    leftColumn += `<div class="nabhel-divider" style="border-top: 0.5px solid ${colors.lightest}; width: 119px; margin: 10px 0;"></div>`;
    
    // Contact Section
    leftColumn += '<div style="margin-bottom: 12px;">';
    
    // Portfolio/Website
    if (data.website) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${colors.lightest}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">`;
        leftColumn += `<span style="font-size: 8px; color: ${colors.medium};">🔗</span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Portfolio</div>`;
        leftColumn += `<a href="${url}" style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; text-decoration: none; line-height: 1.4; display: block;">${escapeHtml(data.website)}</a>`;
        leftColumn += '</div></div>';
    }
    
    // Email
    if (data.email) {
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${colors.lightest}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">`;
        leftColumn += `<span style="font-size: 8px; color: ${colors.medium};"><svg width="10" height="10" viewBox="0 0 0.3 0.3" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.025 0.075A0.025 0.025 0 0 1 0.05 0.05h0.2a0.025 0.025 0 0 1 0.025 0.025v0.15A0.025 0.025 0 0 1 0.25 0.25H0.05A0.025 0.025 0 0 1 0.025 0.225zm0.044 0L0.15 0.146 0.231 0.075zM0.25 0.092 0.158 0.172a0.014 0.014 0 0 1 -0.016 0L0.05 0.092v0.133h0.2z" fill="#0d0d0d"/></svg></span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Email</div>`;
        leftColumn += `<a href="mailto:${escapeHtml(data.email)}" style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; text-decoration: none; line-height: 1.4; display: block;">${escapeHtml(data.email)}</a>`;
        leftColumn += '</div></div>';
    }
    
    // Phone
    if (data.phone) {
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${colors.lightest}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">`;
        leftColumn += `<span style="font-size: 8px; color: ${colors.medium};"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" enable-background="new 0 0 32 32" xml:space="preserve" width="10" height="10"><path fill="none" stroke="#000000" stroke-width="0.625" stroke-miterlimit="10" d="M4.25 2.656 2.969 1.344c-0.156 -0.125 -0.375 -0.125 -0.531 0L1.469 2.344c-0.219 0.188 -0.281 0.5 -0.188 0.75 0.25 0.719 0.906 2.156 2.188 3.438s2.719 1.906 3.438 2.188c0.281 0.094 0.563 0.031 0.781 -0.156l0.969 -0.969c0.156 -0.156 0.156 -0.375 0 -0.531l-1.281 -1.281c-0.156 -0.156 -0.375 -0.156 -0.531 0L6.063 6.563s-0.875 -0.375 -1.563 -1.031 -1.031 -1.563 -1.031 -1.563l0.781 -0.781c0.156 -0.156 0.156 -0.406 0 -0.531z"/></svg></span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Phone</div>`;
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; line-height: 1.4;">${escapeHtml(data.phone)}</div>`;
        leftColumn += '</div></div>';
    }

    if (data.github) {
        const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${colors.lightest}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">`;
        leftColumn += `<span style="font-size: 8px; color: ${colors.medium};"><svg width="10" height="9.796" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 9.796"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.985 0C2.228 0 0 2.245 0 5.022a5.02 5.02 0 0 0 3.409 4.764c.248.05.338-.108.338-.241 0-.116-.008-.516-.008-.931-1.387.299-1.676-.599-1.676-.599-.223-.582-.553-.732-.553-.732-.454-.308.033-.308.033-.308.503.033.768.516.768.516.446.765 1.164.549 1.453.416.041-.324.173-.549.314-.673-1.106-.116-2.27-.549-2.27-2.478 0-.549.198-.998.512-1.347-.049-.125-.223-.64.05-1.33 0 0 .421-.133 1.37.516a4.8 4.8 0 0 1 1.246-.166c.421 0 .85.058 1.246.166.949-.649 1.37-.516 1.37-.516.272.69.099 1.206.049 1.33.322.349.512.798.512 1.347 0 1.929-1.164 2.353-2.278 2.478.182.158.338.457.338.931 0 .673-.008 1.214-.008 1.38 0 .133.091.291.338.241a5.02 5.02 0 0 0 3.409-4.764C9.97 2.245 7.733 0 4.985 0" fill="#24292f"/></svg></span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Github</div>`;
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; line-height: 1.4;">${escapeHtml(data.github)}</div>`;
        leftColumn += '</div></div>';
    }
    
    leftColumn += '</div>';
    
    // Divider
    leftColumn += `<div class="nabhel-divider" style="border-top: 0.5px solid ${colors.lightest}; width: 119px; margin: 10px 0;"></div>`;
    
    // Socials Section
    leftColumn += '<div style="margin-bottom: 12px;">';
    leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; margin-bottom: 12px; line-height: 1.4;">Socials</div>`;
    
    // Instagram
    if (data.instagram) {
        const instagramUrl = data.instagram.startsWith('http') ? data.instagram : `https://${data.instagram}`;
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; flex-shrink: 0;">`;
        leftColumn += `<span style="font-size: 12px;">📷</span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Instagram</div>`;
        leftColumn += `<a href="${instagramUrl}" style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; text-decoration: none; line-height: 1.4; display: block;">${escapeHtml(data.instagram)}</a>`;
        leftColumn += '</div></div>';
    }
    
    // Dribbble
    if (data.dribbble) {
        const dribbbleUrl = data.dribbble.startsWith('http') ? data.dribbble : `https://${data.dribbble}`;
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${colors.dribbble}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">`;
        leftColumn += `<span style="font-size: 8px; color: white;">D</span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Dribbble</div>`;
        leftColumn += `<a href="${dribbbleUrl}" style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; text-decoration: none; line-height: 1.4; display: block;">${escapeHtml(data.dribbble)}</a>`;
        leftColumn += '</div></div>';
    }
    
    // LinkedIn
    if (data.linkedin) {
        leftColumn += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">';
        leftColumn += `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: black; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0px 2px 8px rgba(0,0,0,0.06);">`;
        leftColumn += `<span style="font-size: 8px; color: white;">in</span>`;
        leftColumn += '</div>';
        leftColumn += '<div style="flex: 1;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; line-height: 1.4; margin-bottom: 2px;">Linkedin</div>`;
        leftColumn += `<a href="https://linkedin.com/in/${escapeHtml(data.linkedin)}" style="font-family: ${fontFamily}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; text-decoration: none; line-height: 1.4; display: block;">${escapeHtml(data.linkedin)}</a>`;
        leftColumn += '</div></div>';
    }
    
    leftColumn += '</div>';
    
    // Divider
    leftColumn += `<div class="nabhel-divider" style="border-top: 0.5px solid ${colors.lightest}; width: 119px; margin: 10px 0;"></div>`;
    
    // Skills Section
    if (data.skills && data.skills.trim()) {
        leftColumn += '<div style="margin-bottom: 12px;">';
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${captionSize}; color: ${colors.light}; margin-bottom: 10px; line-height: 1.4;">Skills</div>`;
        const skills = data.skills.split('\n').filter(line => line.trim()).join(', ');
        leftColumn += `<div style="font-family: ${fontFamily}; font-size: ${bodySize}; color: ${colors.light}; line-height: 1.5;">${escapeHtml(skills)}</div>`;
        leftColumn += '</div>';
    }
    
    leftColumn += '</div>';
    
    // RIGHT COLUMN (~75% width) - Main Content
    let rightColumn = '<div style="flex: 0 0 72%; padding: 24px 45px 0 0; background-color: white; box-sizing: border-box;">';
    
    // About Me Section
    if (data.about && data.about.trim()) {
        rightColumn += `<div class="nabhel-section-header" style="font-family: ${interFont}; font-weight: 700; font-size: ${sectionHeaderSize}; color: ${colors.dark}; margin-bottom: 12px;">About Me</div><p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0;">${escapeHtml(data.about).replace(/\n/g, '<br>')}</p>`;
    }
    
    // Experience Section
    if (data.experience && data.experience.length > 0) {
        rightColumn += `<div class="nabhel-section-header" style="font-family: ${interFont}; font-weight: 700; font-size: ${sectionHeaderSize}; color: ${colors.dark}; margin-top: 16px; margin-bottom: 12px;">Experience</div>`;
        data.experience.forEach(entry => {
            const dateStr = formatDateForATS(entry.dateStart, entry.dateEnd);
            rightColumn += `<div style="margin-bottom: 12px;"><div style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 600; color: #2C2F37; margin-bottom: 2px;">${escapeHtml(entry.position)} | ${escapeHtml(entry.company)}</div><div style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; line-height: 1.4; margin-bottom: 4px;">${escapeHtml(dateStr)}${entry.city ? ` ${escapeHtml(entry.city)}` : ''}</div>${entry.description ? `<p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0;">${escapeHtml(entry.description).replace(/\n/g, '<br>')}</p>` : ''}</div>`;
        });
    }
    
    // Education Section
    if (data.education && data.education.length > 0) {
        rightColumn += `<div class="nabhel-section-header" style="font-family: ${interFont}; font-weight: 700; font-size: ${sectionHeaderSize}; color: ${colors.dark}; margin-top: 16px; margin-bottom: 12px;">Education</div>`;
        data.education.forEach(entry => {
            const dateStr = formatDateForATSEducation(entry.dateStart, entry.dateEnd);
            rightColumn += `<div style="margin-bottom: 12px;"><div style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 600; color: #2C2F37; margin-bottom: 2px;">${escapeHtml(entry.degree)}</div><div style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; line-height: 1.4; margin-bottom: 4px;">${escapeHtml(dateStr)}${entry.city ? ` ${escapeHtml(entry.city)}` : ''}</div>${entry.university ? `<p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0 0 4px 0;">${escapeHtml(entry.university).replace(/\n/g, '<br>')}</p>` : ''}${entry.thesis ? `<p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0;">${escapeHtml(entry.thesis).replace(/\n/g, '<br>')}</p>` : ''}</div>`;
        });
    }
    
    // Projects Section
    if (data.projects && data.projects.length > 0) {
        rightColumn += `<div class="nabhel-section-header" style="font-family: ${interFont}; font-weight: 700; font-size: ${sectionHeaderSize}; color: ${colors.dark}; margin-top: 16px; margin-bottom: 12px;">Projects</div>`;
        data.projects.forEach(project => {
            const projectTitle = project.url ? `<a href="${project.url.startsWith('http') ? project.url : 'https://' + project.url}" style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 600; color: ${colors.dark}; text-decoration: none;">${escapeHtml(project.title)}</a>` : `<div style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 600; color: #2C2F37;">${escapeHtml(project.title)}</div>`;
            rightColumn += `<div style="margin-bottom: 12px;">${projectTitle}${project.tech ? `<div style="font-family: ${interFont}; font-size: ${smallSize}; font-weight: 500; color: ${colors.medium}; line-height: 1.4; margin-top: 2px;">${escapeHtml(project.tech)}</div>` : ''}${project.description ? `<p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0;">${escapeHtml(project.description).replace(/\n/g, '<br>')}</p>` : ''}</div>`;
        });
    }
    
    // Certifications Section (using Awards data only)
    if (data.awards && data.awards.trim()) {
        rightColumn += `<div class="nabhel-section-header" style="font-family: ${interFont}; font-weight: 700; font-size: ${sectionHeaderSize}; color: ${colors.dark}; margin-top: 16px; margin-bottom: 12px;">Certifications</div>`;
        data.awards.split('\n').filter(line => line.trim()).forEach(award => {
            rightColumn += `<p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0 0 6px 0;">${escapeHtml(award.trim())}</p>`;
        });
    }
    
    // Publications Section
    if (data.publications && data.publications.trim()) {
        rightColumn += `<div class="nabhel-section-header" style="font-family: ${interFont}; font-weight: 700; font-size: ${sectionHeaderSize}; color: ${colors.dark}; margin-top: 16px; margin-bottom: 12px;">Publications</div>`;
        data.publications.split('\n').filter(line => line.trim()).forEach(publication => {
            rightColumn += `<p style="font-family: ${fontFamily}; font-size: ${bodySize}; font-weight: 400; color: #2C2F37; line-height: 1.6; margin: 0 0 6px 0;">${escapeHtml(publication.trim())}</p>`;
        });
    }
    
    rightColumn += '</div>';
    
    // Close flexbox structure
    html += leftColumn + rightColumn;
    html += '</div>';
    
    return html;
}

// Generate UX/UI Designer CV template
function generateUXUIDesignerCV(data) {
    const fontFamily = 'Arial, sans-serif';
    
    // Enhanced color scheme - more modern and professional
    const colors = {
        sectionHeader: '#8a9196',  // Refined grey for section headers
        bodyText: '#4a5568',       // Improved contrast for body text
        dateLocation: '#718096',   // Better readability for dates/locations
        black: '#1a202c',         // Softer black for better print quality
        linkColor: '#2d3748'       // Subtle link color
    };
    
    // Improved font sizes with better hierarchy
    const nameSize = '26px';
    const titleSize = '22px';
    const sectionHeaderSize = '13px';
    const bodySize = '11px';
    const smallSize = '10px';
    
    let html = '<div style="font-family: ' + fontFamily + '; width: 100%; padding: 28px; box-sizing: border-box; max-width: 100%;">';
    
    // HEADER SECTION - Name and Title with improved styling
    html += '<div class="yodi-header-section" style="margin-bottom: 16px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">';
    
    // Name and Title on one line with better alignment
    html += `<div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;">`;
    html += `<h1 class="text-[${colors.black}] dark:text-white" style="font-size: ${nameSize}; font-weight: 600; margin: 0; line-height: 1.2; letter-spacing: -0.5px;">${escapeHtml(data.name)}</h1>`;
    html += `<div style="width: 1px; height: 20px; background-color: ${colors.sectionHeader}; margin: 0 8px; opacity: 0.6;"></div>`;
    html += `<div class="text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${titleSize}; line-height: 1.3; font-weight: 400;">${escapeHtml(data.title || 'Product Designer')}</div>`;
    html += `</div>`;
    
    html += '</div>';
    
    // Horizontal divider line with improved styling
    html += `<div style="width: 100%; height: 1.5px; background-color: ${colors.sectionHeader}; margin: 24px 0; opacity: 0.4; page-break-inside: avoid;"></div>`;
    
    // MAIN CONTENT - Two columns
    // LEFT COLUMN (wider) - About, Professional Experience
    let leftColumn = '<div style="padding-right: 8px;">';
    
    // About/Summary section at the top of left column with improved styling
    if (data.about && data.about.trim()) {
        leftColumn += `<p class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.6; margin: 0; margin-bottom: 20px; color: ${colors.bodyText};">${escapeHtml(data.about).replace(/\n/g, '<br>')}</p>`;
    }
    
    // Professional Experience Section with improved styling
    if (data.experience && data.experience.length > 0) {
        leftColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Professional Experience</div>`;
        
        data.experience.forEach((entry, index) => {
            if (index > 0) {
                leftColumn += '<div style="margin-bottom: 16px;"></div>';
            }
            
            // Company / Position with improved formatting
            leftColumn += '<div class="yodi-entry" style="margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">';
            leftColumn += `<span class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; color: ${colors.black};">${escapeHtml(entry.company)}</span>`;
            leftColumn += `<span class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; color: ${colors.black};"> <br> ${escapeHtml(entry.position)}</span>`;
            leftColumn += '</div>';
            
            // Date and Location with improved styling
            const dateStr = formatDateForATS(entry.dateStart, entry.dateEnd);
            leftColumn += `<div class="text-[${colors.dateLocation}] dark:text-white" style="font-size: ${bodySize}; font-style: italic; line-height: 1.5; margin-bottom: 8px; color: ${colors.dateLocation};">${escapeHtml(dateStr)}${entry.city ? `${escapeHtml(entry.city)}` : ''}</div>`;
            
            // Company description with improved formatting
            if (entry.description) {
                const descLines = entry.description.split('\n').filter(line => line.trim());
                if (descLines.length > 0) {
                    // First line as regular text
                    leftColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.6; margin-bottom: 6px; color: ${colors.bodyText};">${escapeHtml(descLines[0])}</div>`;
                    
                    // Bullet points (remaining lines) with improved styling
                    if (descLines.length > 1) {
                        leftColumn += '<div style="margin: 6px 0 0 0; list-style: disc; list-style-position: outside;">';
                        for (let i = 1; i < descLines.length; i++) {
                            leftColumn += `<span class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.6; margin-bottom: 4px; color: ${colors.bodyText};">${escapeHtml(descLines[i])}</span>`;
                        }
                        leftColumn += '</div>';
                    }
                }
            }
        });
    }
    
    // Projects Section (in left column, after experience) with improved styling
    if (data.projects && data.projects.length > 0) {
        leftColumn += '<div style="margin-top: 28px;"></div>';
        leftColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Projects</div>`;
        
        data.projects.forEach((project, index) => {
            if (index > 0) {
                leftColumn += '<div style="margin-bottom: 16px;"></div>';
            }
            
            // Project Title with improved formatting
            leftColumn += '<div class="yodi-entry" style="margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">';
            leftColumn += `<span class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; color: ${colors.black};">${escapeHtml(project.title)}</span>`;
            if (project.tech) {
                const techParts = project.tech.split(',');
                if (techParts.length > 0 && techParts[0].trim()) {
                    leftColumn += `<span class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; color: ${colors.black};"> <br> ${escapeHtml(techParts[0].trim())}</span>`;
                }
            }
            leftColumn += '</div>';
            
            // Project Description with improved formatting
            if (project.description) {
                const descLines = project.description.split('\n').filter(line => line.trim());
                if (descLines.length > 0) {
                    // First line as regular text
                    leftColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.6; margin-bottom: 6px; color: ${colors.bodyText};">${escapeHtml(descLines[0])}</div>`;
                    
                    // Bullet points (remaining lines) with improved styling
                    if (descLines.length > 1) {
                        leftColumn += '<ul style="margin: 6px 0 0 0; padding-left: 18px; list-style: disc; list-style-position: outside;">';
                        for (let i = 1; i < descLines.length; i++) {
                            leftColumn += `<li class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.6; margin-bottom: 4px; color: ${colors.bodyText};">${escapeHtml(descLines[i])}</li>`;
                        }
                        leftColumn += '</ul>';
                    }
                }
            }
        });
    }
    
    leftColumn += '</div>';
    
    // RIGHT COLUMN (narrower) - Contact, Education, Certificate, Skills, Languages
    let rightColumn = '<div style="width: 200px; padding-left: 8px;">';
    
    // Contact info at the top of right column with improved styling
    if (data.website || data.email || data.phone || data.location || data.linkedin || data.github || data.dribbble) {
        rightColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Contact</div>`;
        rightColumn += '<div class="yodi-entry" style="margin-bottom: 24px; page-break-inside: avoid; break-inside: avoid;">';
        if (data.website) {
            const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px; word-break: break-word;"><a href="${url}" style="color: ${colors.linkColor}; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s;">${escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a></div>`;
        }
        if (data.email) {
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px; word-break: break-all;"><a href="mailto:${escapeHtml(data.email)}" style="color: ${colors.linkColor}; text-decoration: none;">${escapeHtml(data.email)}</a></div>`;
        }
        if (data.phone) {
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px;">${escapeHtml(data.phone)}</div>`;
        }
        if (data.location) {
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px;">${escapeHtml(data.location)}</div>`;
        }
        if (data.linkedin) {
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px;"><a href="https://linkedin.com/in/${escapeHtml(data.linkedin)}" style="color: ${colors.linkColor}; text-decoration: none;">LinkedIn</a></div>`;
        }
        if (data.github) {
            const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px;"><a href="${githubUrl}" style="color: ${colors.linkColor}; text-decoration: none;">GitHub</a></div>`;
        }
        if (data.dribbble) {
            const dribbbleUrl = data.dribbble.startsWith('http') ? data.dribbble : `https://${data.dribbble}`;
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${smallSize}; line-height: 1.5; margin-bottom: 6px;"><a href="${dribbbleUrl}" style="color: ${colors.linkColor}; text-decoration: none;">Dribbble</a></div>`;
        }
        rightColumn += '</div>';
    }
    
    // Education Section with improved styling
    if (data.education && data.education.length > 0) {
        rightColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Education</div>`;
        
        data.education.forEach((entry, index) => {
            if (index > 0) {
                rightColumn += '<div style="margin-bottom: 8px;"></div>';
            }
            rightColumn += '<div class="yodi-entry" style="margin-bottom: 16px; page-break-inside: avoid; break-inside: avoid;">';
            rightColumn += `<div class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; line-height: 1.4; margin-bottom: 6px; color: ${colors.black};">${escapeHtml(entry.university)}</div>`;
            rightColumn += `<div class="text-[${colors.black}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.5; margin-bottom: 6px; color: ${colors.black};">${escapeHtml(entry.degree)}</div>`;
            const dateStr = formatDateForATSEducation(entry.dateStart, entry.dateEnd);
            rightColumn += `<div class="text-[${colors.dateLocation}] dark:text-white" style="font-size: ${bodySize}; font-style: italic; line-height: 1.5; margin-bottom: 6px; color: ${colors.dateLocation};">${escapeHtml(dateStr)}</div>`;
            if (entry.thesis) {
                rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.5; color: ${colors.bodyText};">${escapeHtml(entry.thesis)}</div>`;
            } else if (entry.gpa) {
                rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.5; color: ${colors.bodyText};">GPA: ${escapeHtml(entry.gpa)}</div>`;
            }
            rightColumn += '</div>';
        });
    }
    
    // Certificate Section - Parse awards to extract name, dates, and description
    if (data.awards && data.awards.trim()) {
        rightColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Certificate</div>`;
        
        const awards = data.awards.split('\n').filter(line => line.trim());
        awards.forEach((award, index) => {
            if (index > 0) {
                rightColumn += '<div style="margin-bottom: 8px;"></div>';
            }
            rightColumn += '<div class="yodi-entry" style="margin-bottom: 16px; page-break-inside: avoid; break-inside: avoid;">';
            
            // Try to parse certificate format: "Name Date Range Description" or "Name ..... Date Range"
            const awardText = award.trim();
            // Check for date pattern (e.g., "Sep 2022 - Jan 2023", "Jan 2023 - Present", or "2022-2023")
            const datePattern = /(\w{3}\s+\d{4}\s*-\s*(\w{3}\s+\d{4}|Present|\d{4})|\d{4}\s*-\s*(\d{4}|Present)|\d{4})/;
            const dateMatch = awardText.match(datePattern);
            
            if (dateMatch) {
                // Has date - extract name, date, and description
                const dateStr = dateMatch[0];
                const dateIndex = awardText.indexOf(dateStr);
                const beforeDate = awardText.substring(0, dateIndex).trim();
                const afterDate = awardText.substring(dateIndex + dateStr.length).trim();
                
                // Name is before date (remove trailing dots/spaces)
                const name = beforeDate.replace(/\.+\s*$/, '').trim();
                
                // Description is after date
                const description = afterDate.replace(/^[-–—]\s*/, '').trim(); // Remove leading dash if present
                
                rightColumn += `<div class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 6px; color: ${colors.black};">${escapeHtml(name)}</div>`;
                rightColumn += `<div class="text-[${colors.dateLocation}] dark:text-white" style="font-size: ${bodySize}; font-style: italic; line-height: 1.5; margin-bottom: 6px; color: ${colors.dateLocation};">${escapeHtml(dateStr)}</div>`;
                if (description) {
                    rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.5; color: ${colors.bodyText};">${escapeHtml(description)}</div>`;
                }
            } else {
                // No date - try to parse "Name ..... Year" format
                const dotPattern = /\.{3,}/;
                const dotMatch = awardText.match(dotPattern);
                if (dotMatch) {
                    const parts = awardText.split(dotPattern);
                    const name = parts[0].trim();
                    const year = parts.slice(1).join('').trim();
                    rightColumn += `<div class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 6px; color: ${colors.black};">${escapeHtml(name)}</div>`;
                    if (year) {
                        rightColumn += `<div class="text-[${colors.dateLocation}] dark:text-white" style="font-size: ${bodySize}; font-style: italic; line-height: 1.5; color: ${colors.dateLocation};">${escapeHtml(year)}</div>`;
                    }
                } else {
                    // Just show as name
                    rightColumn += `<div class="text-[${colors.black}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 6px; color: ${colors.black};">${escapeHtml(awardText)}</div>`;
                }
            }
            
            rightColumn += '</div>';
        });
    }
    
    // Skills & Software Section with improved styling
    if (data.skills && data.skills.trim()) {
        rightColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Skills & Software</div>`;
        
        // Try to parse Skills and Software separately
        const skillsText = data.skills.trim();
        let skillsList = '';
        let softwareList = '';
        
        // Check if there are explicit labels
        const skillsMatch = skillsText.match(/Skills?[:\s]+(.*?)(?:\n|$|Software)/i);
        const softwareMatch = skillsText.match(/Software[:\s]+(.*?)(?:\n|$)/i);
        
        if (skillsMatch && softwareMatch) {
            // Has both labels - extract separately
            skillsList = skillsMatch[1].trim();
            softwareList = softwareMatch[1].trim();
        } else {
            // No labels - try to split by lines and check for patterns
            const lines = skillsText.split('\n').filter(line => line.trim());
            const skillsLines = [];
            const softwareLines = [];
            
            let currentSection = 'skills';
            lines.forEach(line => {
                const lowerLine = line.toLowerCase();
                if (lowerLine.includes('software') || lowerLine.startsWith('software:')) {
                    currentSection = 'software';
                    const content = line.replace(/^software:?\s*/i, '').trim();
                    if (content) softwareLines.push(content);
                } else if (lowerLine.includes('skill') || lowerLine.startsWith('skill:')) {
                    currentSection = 'skills';
                    const content = line.replace(/^skill:?\s*/i, '').trim();
                    if (content) skillsLines.push(content);
                } else {
                    // Add to current section
                    if (currentSection === 'software') {
                        softwareLines.push(line.trim());
                    } else {
                        skillsLines.push(line.trim());
                    }
                }
            });
            
            if (skillsLines.length > 0 || softwareLines.length > 0) {
                skillsList = skillsLines.join(', ');
                softwareList = softwareLines.join(', ');
            } else {
                // Fallback: use all as skills, and also as software
                skillsList = lines.join(', ');
                softwareList = lines.join(', ');
            }
        }
        
        // Display Skills with improved styling
        if (skillsList) {
            rightColumn += `<div class="text-[${colors.black}] dark:text-white" style="font-size: ${bodySize}; font-weight: 700; margin-bottom: 6px; color: ${colors.black};">Skills</div>`;
            rightColumn += `<div class="text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.5; margin-bottom: 16px; color: ${colors.bodyText};">${escapeHtml(skillsList)}</div>`;
        }
        
    }
    
    // Languages Section with improved styling
    if (data.languages && data.languages.length > 0) {
        rightColumn += `<div class="yodi-section text-[${colors.sectionHeader}] dark:text-white" style="font-size: ${sectionHeaderSize}; font-weight: 700; margin-bottom: 16px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.5px; page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">Languages</div>`;
        
        data.languages.forEach((lang, index) => {
            const langName = lang.name || '';
            const langLevel = lang.level || '';
            rightColumn += `<div class="yodi-entry text-[${colors.bodyText}] dark:text-white" style="font-size: ${bodySize}; line-height: 1.5; margin-bottom: ${index < data.languages.length - 1 ? '8px' : '0'}; page-break-inside: avoid; break-inside: avoid; color: ${colors.bodyText};">${escapeHtml(langName)}${langLevel ? ` (${escapeHtml(langLevel)})` : ''}</div>`;
        });
    }
    
    rightColumn += '</div>';
    
    // Output columns directly without wrapper div - cvContainer is the only wrapper
    html += leftColumn + rightColumn;
    
    html += '</div>';
    
    return html;
}

function formatDateForATS(startDate, endDate) {
    if (!startDate && !endDate) return '';
    
    const formatMonthYear = (dateStr) => {
        if (!dateStr) return '';
        const [year, month] = dateStr.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = parseInt(month) - 1;
        return `${monthNames[monthIndex] || 'Jan'} ${year}`;
    };
    
    const start = formatMonthYear(startDate);
    const end = endDate ? formatMonthYear(endDate) : 'Present';
    
    if (!start) return end;
    return `${start} - ${end}`;
}

// Format date for ATS template - Education (e.g., "2018 - 2023")
function formatDateForATSEducation(startDate, endDate) {
    if (!startDate && !endDate) return '';
    
    const formatYear = (dateStr) => {
        if (!dateStr) return '';
        return dateStr.split('-')[0];
    };
    
    const start = formatYear(startDate);
    const end = endDate ? formatYear(endDate) : '';
    
    if (!start) return end;
    if (!end) return start;
    return `${start} - ${end}`;
}

// Generate Minimal CV - Two-column minimalist layout
// Based on Figma design: https://www.figma.com/design/j8FqjbcKBIswmXcWeY2SM1/Minimal-Resume-and-Cover-letter-template
function generateMinimalCV(data) {
    const baseStyle = 'font-size: 12px;';
    const nameStyle = 'font-size: 32px; font-weight: bold; margin-bottom: 4px;';
    const titleStyle = 'font-size: 12px; font-weight: bold; margin-bottom: 24px; text-transform: uppercase;';
    const sectionHeaderStyle = 'font-size: 12px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase;';
    const separatorStyle = 'border-top: 1px solid currentColor; margin: 16px 0; opacity: 0.3;';
    
    // Start two-column layout using flexbox
    let html = '<div style="display: flex; width: 100%; font-family: \'Montserrat\', Arial, sans-serif;">';
    
    // LEFT COLUMN (~33%)
    let leftColumn = '<div style="flex: 0 0 33%; padding-right: 15px; padding-top: 0;">';
    
    // Name
    leftColumn += `<div style="margin-bottom: 4px;"><h1 class="minimal-name" style="${nameStyle}">${escapeHtml(data.name)}</h1></div>`;
    
    // Job Title
    if (data.title && data.title.trim()) {
        leftColumn += `<div class="minimal-title" style="${titleStyle}">${escapeHtml(data.title)}</div>`;
    }
    
    // Profile Image (only if present) - placed after name and title for better visual flow
    if (data.photo && data.photo.trim()) {
        leftColumn += '<div style="margin-top: 20px; margin-bottom: 20px;">';
        // Portrait format container (210px width x 300px height = 3:4.3 ratio)
        leftColumn += '<div style="width: 210px; height: 300px; overflow: hidden; background-color: #f0f0f0; position: relative;">';
        // Don't escape the photo data URL - it's already a valid data URL
        leftColumn += `<img src="${data.photo}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; position: absolute; top: 0; left: 0;">`;
        leftColumn += '</div></div>';
    }

    // Contact Section
    leftColumn += '<div style="margin-top: 30px; margin-bottom: 30px;">';
    leftColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">CONTACT</div>`;
    leftColumn += '<div style="font-family: \'Montserrat\', Arial, sans-serif; font-size: 11px; line-height: 1.8;">';
    
    if (data.birthdate || data.cityOfBirth) {
        let birthInfo = '';
        if (data.birthdate) {
            // Format date as "Month Day, Year" or just display the date
            const date = new Date(data.birthdate);
            if (!isNaN(date.getTime())) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                birthInfo = date.toLocaleDateString('en-US', options);
            } else {
                birthInfo = data.birthdate;
            }
        }
        if (data.cityOfBirth) {
            birthInfo = birthInfo ? `${escapeHtml(data.cityOfBirth)}, ${birthInfo}` : escapeHtml(data.cityOfBirth);
        }
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg width="10" height="10" viewBox="-0.025 -0.038 0.3 0.3" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-calendar"><path d="M.225.088V.063A.013.013 0 0 0 .212.05H.199v.013a.013.013 0 0 1-.025 0V.05H.075v.013a.013.013 0 1 1-.025 0V.05H.038a.013.013 0 0 0-.013.013v.025zm0 .025h-.2v.075a.013.013 0 0 0 .013.013h.175A.013.013 0 0 0 .226.188zM.2.025h.013a.04.04 0 0 1 .038.038v.125a.04.04 0 0 1-.038.038H.038A.04.04 0 0 1 0 .188V.063A.04.04 0 0 1 .038.025h.013V.013a.013.013 0 1 1 .025 0v.013h.1V.013a.013.013 0 0 1 .025 0z"/></svg></span><span>${birthInfo}</span></div>`;
    }
    if (data.phone) {
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" enable-background="new 0 0 32 32" xml:space="preserve" width="10" height="10"><path fill="none" stroke="#000000" stroke-width="0.625" stroke-miterlimit="10" d="M4.25 2.656 2.969 1.344c-0.156 -0.125 -0.375 -0.125 -0.531 0L1.469 2.344c-0.219 0.188 -0.281 0.5 -0.188 0.75 0.25 0.719 0.906 2.156 2.188 3.438s2.719 1.906 3.438 2.188c0.281 0.094 0.563 0.031 0.781 -0.156l0.969 -0.969c0.156 -0.156 0.156 -0.375 0 -0.531l-1.281 -1.281c-0.156 -0.156 -0.375 -0.156 -0.531 0L6.063 6.563s-0.875 -0.375 -1.563 -1.031 -1.031 -1.563 -1.031 -1.563l0.781 -0.781c0.156 -0.156 0.156 -0.406 0 -0.531z"/></svg></span><span>${escapeHtml(data.phone)}</span></div>`;
    }
    if (data.email) {
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg width="10" height="10" viewBox="0 0 0.3 0.3" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.025 0.075A0.025 0.025 0 0 1 0.05 0.05h0.2a0.025 0.025 0 0 1 0.025 0.025v0.15A0.025 0.025 0 0 1 0.25 0.25H0.05A0.025 0.025 0 0 1 0.025 0.225zm0.044 0L0.15 0.146 0.231 0.075zM0.25 0.092 0.158 0.172a0.014 0.014 0 0 1 -0.016 0L0.05 0.092v0.133h0.2z" fill="#0d0d0d"/></svg></span><a href="mailto:${escapeHtml(data.email)}" style="color: #000; text-decoration: none;">${escapeHtml(data.email)}</a></div>`;
    }
    if (data.location) {
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg width="10" height="10" viewBox="0 0 0.3 0.3" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M.15.025c.062 0 .113.05.113.111q0 .061-.101.131L.15.275.143.27Q.038.199.038.136c0-.061.05-.111.112-.111m0 .025a.09.09 0 0 0-.088.087q0 .046.088.108Q.238.182.238.137A.087.087 0 0 0 .15.05m0 .025a.05.05 0 1 1 0 .1.05.05 0 0 1 0-.1M.15.1a.025.025 0 1 0 0 .05.025.025 0 0 0 0-.05"/></svg></span><span>${escapeHtml(data.location)}</span></div>`;
    }
    if (data.linkedin) {
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 3 3"><path d="M2.4.4H.6a.2.2 0 0 0-.2.2v1.8a.2.2 0 0 0 .2.2h1.8a.2.2 0 0 0 .2-.2V.6a.2.2 0 0 0-.2-.2M1.095 2.2H.8v-.949h.295zm-.15-1.085a.172.172 0 1 1 0-.344.172.172 0 0 1 0 .344M2.2 2.2h-.295v-.462c0-.11-.002-.252-.153-.252-.153 0-.177.12-.177.244v.47H1.28v-.949h.283v.13h.004a.31.31 0 0 1 .279-.153c.299 0 .354.197.354.452z"/></svg></span><a href="https://linkedin.com/in/${escapeHtml(data.linkedin)}" style="color: #000; text-decoration: none;">${escapeHtml(data.linkedin)}</a></div>`;
    }
    if (data.website) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg width="10" height="10" viewBox="-0.038 -0.038 0.3 0.3" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-link"><path d="M.04.117a.012.012 0 0 1 .017 0 .012.012 0 0 1 0 .017L.031.16a.024.024 0 0 0 0 .034.024.024 0 0 0 .034 0l.06-.06a.012.012 0 0 0 0-.017.012.012 0 0 1 0-.017.012.012 0 0 1 .017 0 .036.036 0 0 1 0 .051l-.06.06a.05.05 0 0 1-.069 0 .05.05 0 0 1 0-.068zM.185.108a.012.012 0 0 1-.017 0 .012.012 0 0 1 0-.017L.194.065a.024.024 0 0 0 0-.034.024.024 0 0 0-.034 0L.1.091a.012.012 0 0 0 0 .017.012.012 0 0 1 0 .017.012.012 0 0 1-.017 0 .036.036 0 0 1 0-.051l.06-.06a.05.05 0 0 1 .069 0 .05.05 0 0 1 0 .068z"/></svg></span><a href="${url}" style="color: #000; text-decoration: none;">${escapeHtml(data.website)}</a></div>`;
    }
    if (data.github) {
        const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg width="10" height="9.796" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 9.796"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.985 0C2.228 0 0 2.245 0 5.022a5.02 5.02 0 0 0 3.409 4.764c.248.05.338-.108.338-.241 0-.116-.008-.516-.008-.931-1.387.299-1.676-.599-1.676-.599-.223-.582-.553-.732-.553-.732-.454-.308.033-.308.033-.308.503.033.768.516.768.516.446.765 1.164.549 1.453.416.041-.324.173-.549.314-.673-1.106-.116-2.27-.549-2.27-2.478 0-.549.198-.998.512-1.347-.049-.125-.223-.64.05-1.33 0 0 .421-.133 1.37.516a4.8 4.8 0 0 1 1.246-.166c.421 0 .85.058 1.246.166.949-.649 1.37-.516 1.37-.516.272.69.099 1.206.049 1.33.322.349.512.798.512 1.347 0 1.929-1.164 2.353-2.278 2.478.182.158.338.457.338.931 0 .673-.008 1.214-.008 1.38 0 .133.091.291.338.241a5.02 5.02 0 0 0 3.409-4.764C9.97 2.245 7.733 0 4.985 0" fill="#24292f"/></svg></span><a href="${githubUrl}" style="color: #000; text-decoration: none;">${escapeHtml(data.github)}</a></div>`;
    }
    if (data.dribbble) {
        const dribbbleUrl = data.dribbble.startsWith('http') ? data.dribbble : `https://${data.dribbble}`;
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="display:flex; justify-items: center; 
    align-items: center; width: 12px; height: 12px;"><svg width="10" height="10" viewBox="0 0 0.3 0.3" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M.15.025a.13.13 0 0 0-.105.057.125.125 0 0 0 .183.165A.125.125 0 0 0 .15.025m.025.028a.1.1 0 0 1 .072.072.1.1 0 0 0-.059.017.2.2 0 0 0-.03-.028.13.13 0 0 0 .017-.061M.15.05a.1.1 0 0 1-.014.051L.13.098A.2.2 0 0 0 .079.08.1.1 0 0 1 .15.05M.063.102A.2.2 0 0 1 .119.12l.002.001A.1.1 0 0 1 .05.15.1.1 0 0 1 .063.102m.063.145A.1.1 0 0 1 .053.175a.12.12 0 0 0 .089-.04l.025.023a.13.13 0 0 0-.042.089M.15.25A.1.1 0 0 1 .182.177L.184.18a.2.2 0 0 1 .023.052A.1.1 0 0 1 .15.25M.228.212A.2.2 0 0 0 .205.165L.203.163A.1.1 0 0 1 .251.15a.1.1 0 0 1-.022.063"/></svg></span><a href="${dribbbleUrl}" style="color: #000; text-decoration: none;">${escapeHtml(data.dribbble)}</a></div>`;
    }
    if (data.instagram) {
        const instagramUrl = data.instagram.startsWith('http') ? data.instagram : `https://${data.instagram}`;
        leftColumn += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="font-size: 12px;">📷</span><a href="${instagramUrl}" style="color: #000; text-decoration: none;">${escapeHtml(data.instagram)}</a></div>`;
    }
    
    leftColumn += '</div></div>';
    leftColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
    
    // About Section
    if (data.about && data.about.trim()) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">ABOUT ME</div>`;
        leftColumn += `<div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 11px; line-height: 1.6;">${escapeHtml(data.about).replace(/\n/g, '<br>')}</div>`;
        leftColumn += '</div>';
        leftColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
    }
    
    // Education Section
    if (data.education && data.education.length > 0) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">EDUCATION</div>`;
        leftColumn += '<div style="font-family: \'Montserrat\', Arial, sans-serif; font-size: 11px; line-height: 1.7;">';
        
        data.education.forEach((entry, index) => {
            // Format date range
            let dateStr = '';
            if (entry.dateStart && entry.dateEnd) {
                const startYear = entry.dateStart.split('-')[0];
                const endYear = entry.dateEnd.split('-')[0];
                dateStr = `${startYear} - ${endYear}`;
            } else if (entry.dateStart) {
                const startYear = entry.dateStart.split('-')[0];
                dateStr = startYear;
            } else if (entry.dateEnd) {
                const endYear = entry.dateEnd.split('-')[0];
                dateStr = endYear;
            }
            
            leftColumn += `<div style="margin-bottom: ${index < data.education.length - 1 ? '16px' : '0'};">`;
            
            // University name - prominent
            leftColumn += `<div style="margin-bottom: 6px; font-family: 'Montserrat', Arial, sans-serif; font-size: 11px; font-weight: 500; color: #000; line-height: 1.5;">${escapeHtml(entry.university)}${entry.city ? `, ${escapeHtml(entry.city)}` : ''}</div>`;
            
            // Degree - slightly emphasized
            if (entry.degree) {
                leftColumn += `<div style="margin-bottom: ${entry.gpa || entry.thesis ? '4px' : '0'}; font-family: 'Montserrat', Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.5;">${escapeHtml(entry.degree)}</div>`;
            }
            
            // Date - subtle, if present
            if (dateStr) {
                leftColumn += `<div style="margin-bottom: ${entry.gpa || entry.thesis ? '4px' : '0'}; font-family: 'Montserrat', Arial, sans-serif; font-size: 10px; color: #666; font-weight: 500; line-height: 1.5;">${escapeHtml(dateStr)}</div>`;
            }
            
            // GPA - subtle
            if (entry.gpa) {
                leftColumn += `<div style="margin-bottom: ${entry.thesis ? '4px' : '0'}; font-family: 'Montserrat', Arial, sans-serif; font-size: 10px; color: #666; line-height: 1.5;">GPA: ${escapeHtml(entry.gpa)}</div>`;
            }
            
            // Thesis - italic, subtle
            if (entry.thesis) {
                leftColumn += `<div style="margin-bottom: 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 10px; color: #666; font-style: italic; line-height: 1.5;">${escapeHtml(entry.thesis)}</div>`;
            }
            
            leftColumn += '</div>';
        });
        
        leftColumn += '</div></div>';
        leftColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
    }
    
    // Skills Section
    if (data.skills && data.skills.trim()) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">SKILLS</div>`;
        leftColumn += '<div style="font-family: \'Montserrat\', Arial, sans-serif; font-size: 11px; line-height: 1.8;">';
        
        const skills = data.skills.split('\n').filter(line => line.trim());
        skills.forEach(skill => {
            leftColumn += `<div style="margin-bottom: 2px;">• ${escapeHtml(skill.trim())}</div>`;
        });
        
        leftColumn += '</div></div>';
        leftColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
    }
    
    // Languages Section
    if (data.languages && data.languages.length > 0) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">LANGUAGES</div>`;
        leftColumn += '<div style="font-family: \'Montserrat\', Arial, sans-serif; font-size: 11px; line-height: 1.8;">';
        
        data.languages.forEach(entry => {
            leftColumn += `<div style="margin-bottom: 2px;">${escapeHtml(entry.name)}${entry.level ? ` - ${escapeHtml(entry.level)}` : ''}</div>`;
        });
        
        leftColumn += '</div></div>';
        leftColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
    }
    
    // Hobbies Section
    if (data.hobbies && data.hobbies.trim()) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">HOBBIES</div>`;
        leftColumn += '<div style="font-family: \'Montserrat\', Arial, sans-serif; font-size: 11px; line-height: 1.8;">';
        
        const hobbies = data.hobbies.split('\n').filter(line => line.trim());
        hobbies.forEach(hobby => {
            leftColumn += `<div style="margin-bottom: 2px;">• ${escapeHtml(hobby.trim())}</div>`;
        });
        
        leftColumn += '</div></div>';
    }
    
    leftColumn += '</div>';
    
    // RIGHT COLUMN (~67%)
    let rightColumn = '<div style="flex: 0 0 67%; padding-left: 24px; padding-top: 0;">';
    
    // Experience Section
    if (data.experience && data.experience.length > 0) {
        rightColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle} margin-top: 0;">EXPERIENCE</div><div class="minimal-separator" style="${separatorStyle}"></div>`;
        data.experience.forEach((entry, index) => {
            let dateStr = '';
            if (entry.dateStart && entry.dateEnd) {
                dateStr = `${entry.dateStart.split('-')[0]}-${entry.dateEnd.split('-')[0]}`;
            } else if (entry.dateStart) {
                dateStr = `${entry.dateStart.split('-')[0]}-Present`;
            } else if (entry.dateEnd) {
                dateStr = `-${entry.dateEnd.split('-')[0]}`;
            }
            const items = entry.description ? entry.description.split('\n').filter(line => line.trim()).map(item => `<div style="margin-bottom: 4px;">${escapeHtml(item.trim())}</div>`).join('') : '';
            rightColumn += `<div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">${escapeHtml(entry.company)}${entry.city ? `, ${escapeHtml(entry.city)}` : ''}</div><div style="font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #79819A;">${escapeHtml(entry.position)}${dateStr ? ` | ${dateStr}` : ''}</div>${items ? `<div style="font-size: 11px; line-height: 1.6; margin-bottom: 24px;">${items}</div>` : '<div style="margin-bottom: 24px;"></div>'}`;
        });
    }
    
    // Projects Section (if no experience or as additional section)
    if (data.projects && data.projects.length > 0) {
        rightColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">PROJECTS</div>${data.experience && data.experience.length > 0 ? `<div class="minimal-separator" style="${separatorStyle}"></div>` : ''}`;
        data.projects.forEach((entry, index) => {
            const items = entry.description ? entry.description.split('\n').filter(line => line.trim()).map(item => `<div style="margin-bottom: 4px;">${escapeHtml(item.trim())}</div>`).join('') : '';
            rightColumn += `<div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">${escapeHtml(entry.title)}${entry.tech ? ` (${escapeHtml(entry.tech)})` : ''}</div>${items ? `<div style="font-size: 11px; line-height: 1.6; margin-bottom: 16px;">${items}</div>` : '<div style="margin-bottom: 16px;"></div>'}`;
        });
    }
    
    // Volunteer Section
    if (data.volunteer && data.volunteer.length > 0) {
        const hasPrevSection = data.experience && data.experience.length > 0 || data.projects && data.projects.length > 0;
        rightColumn += `${hasPrevSection ? `<div class="minimal-separator" style="${separatorStyle}"></div>` : ''}<div class="minimal-section-header" style="${sectionHeaderStyle}">VOLUNTEER</div>${hasPrevSection ? `<div class="minimal-separator" style="${separatorStyle}"></div>` : ''}`;
        data.volunteer.forEach((entry, index) => {
            let dateStr = '';
            if (entry.dateStart && entry.dateEnd) {
                dateStr = `${entry.dateStart.split('-')[0]}-${entry.dateEnd.split('-')[0]}`;
            } else if (entry.dateStart) {
                dateStr = `${entry.dateStart.split('-')[0]}-Present`;
            } else if (entry.dateEnd) {
                dateStr = `-${entry.dateEnd.split('-')[0]}`;
            }
            const items = entry.description ? entry.description.split('\n').filter(line => line.trim()).map(item => `<div style="margin-bottom: 4px;">${escapeHtml(item.trim())}</div>`).join('') : '';
            rightColumn += `<div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">${escapeHtml(entry.organization)}</div><div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">${escapeHtml(entry.position)}${dateStr ? ` | ${dateStr}` : ''}</div>${items ? `<div style="font-size: 11px; line-height: 1.6; margin-bottom: 24px;">${items}</div>` : '<div style="margin-bottom: 24px;"></div>'}${index < data.volunteer.length - 1 ? `<div class="minimal-separator" style="${separatorStyle}"></div>` : ''}`;
        });
    }
    
    // Publications Section
    if (data.publications && data.publications.trim()) {
        rightColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">PUBLICATIONS</div>`;
        if (data.experience && data.experience.length > 0 || data.projects && data.projects.length > 0 || data.volunteer && data.volunteer.length > 0) {
            rightColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
        }
        
        const publications = data.publications.split('\n').filter(line => line.trim());
        publications.forEach((pub, index) => {
            rightColumn += `<div style="font-size: 11px; margin-bottom: 8px; line-height: 1.6;">${escapeHtml(pub.trim())}</div>`;
        });
    }
    
    // Awards Section
    if (data.awards && data.awards.trim()) {
        rightColumn += `<div class="minimal-section-header" style="${sectionHeaderStyle}">AWARDS</div>`;
        if (data.experience && data.experience.length > 0 || data.projects && data.projects.length > 0 || data.volunteer && data.volunteer.length > 0 || data.publications && data.publications.trim()) {
            rightColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
        }
        
        const awards = data.awards.split('\n').filter(line => line.trim());
        awards.forEach((award, index) => {
            rightColumn += `<div style="font-size: 11px; margin-bottom: 8px; line-height: 1.6;">${escapeHtml(award.trim())}</div>`;
            if (index < awards.length - 1) {
                rightColumn += `<div class="minimal-separator" style="${separatorStyle}"></div>`;
            }
        });
    }
    
    rightColumn += '</div>';
    
    // Close flexbox structure
    html += leftColumn + rightColumn;
    html += '</div>';
    
    return html;
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const cvForm = document.getElementById('cvForm');
    if (cvForm) {
        cvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submitted');
            
            // Check HTML5 validation first
            if (!cvForm.checkValidity()) {
                console.log('Form validation failed');
                cvForm.reportValidity();
                return;
            }
            
            const data = collectFormData();
            const template = data.template || 'classic';
            
            console.log('Collected form data:', data);
            console.log('Template:', template);
            
            // Validate required fields
            if (!data.name || !data.email) {
                alert('Please fill in all required fields (Name and Email).');
                return;
            }
            
            // Save to localStorage
            try {
                localStorage.setItem('cvData', JSON.stringify(data));
                console.log('Data saved to localStorage, redirecting to template page...');
                const redirectUrl = `template/${template}.html`;
                console.log('Redirect URL:', redirectUrl);
                
                // Redirect to template page (use replace to avoid back button issues)
                window.location.replace(redirectUrl);
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                alert('Error saving data. Please try again.');
            }
        });
    }
    // Note: cvForm may not exist on template pages, which is expected
});

// Automatically load data from localStorage on page load (only on form page)
document.addEventListener('DOMContentLoaded', function() {
    // Only load if we're on the form page (check if cvForm exists)
    const cvForm = document.getElementById('cvForm');
    if (!cvForm) {
        return; // Not on the form page, skip auto-load
    }
    
    try {
        const cvDataJson = localStorage.getItem('cvData');
        if (cvDataJson) {
            const data = JSON.parse(cvDataJson);
            console.log('Found CV data in localStorage, automatically loading into form...');
            loadFormData(data);
        }
    } catch (error) {
        console.warn('Error loading data from localStorage:', error);
        // Silently fail - don't show error to user if localStorage is unavailable
    }
});

// Template selection change handler for immediate visual feedback
document.addEventListener('DOMContentLoaded', function() {
    const templateInputs = document.querySelectorAll('input[name="template"]');
    templateInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Force re-render of peer-checked states by triggering a repaint
            templateInputs.forEach(inp => {
                const label = inp.closest('label');
                if (label) {
                    label.classList.remove('selected');
                    if (inp.checked) {
                        label.classList.add('selected');
                    }
                }
            });
        });
    });
    
    // Initialize selected state on page load
    const checkedInput = document.querySelector('input[name="template"]:checked');
    if (checkedInput) {
        const label = checkedInput.closest('label');
        if (label) {
            label.classList.add('selected');
        }
    }
});

// Ensure preview maintains US Letter size on window resize
function updatePreviewSize() {
    const cvPreviewElement = document.getElementById('cvPreview');
    const previewSection = document.getElementById('cvPreviewSection');
    if (cvPreviewElement && previewSection && !previewSection.classList.contains('hidden')) {
        resetPreviewStyles(cvPreviewElement);
    }
}

// Add resize listener for responsive preview
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updatePreviewSize, 250);
});

// Helper function to show preview section

// Helper function to reset preview element styles for standard templates
function resetPreviewStyles(cvPreviewElement) {
    // US Letter size: 8.5in x 11in = 216mm x 279mm
    // At 96 DPI: 816px x 1056px
    // At 72 DPI: 612px x 792px (more common for web)
    // Using 612px width for US Letter portrait at 72 DPI
    // On smaller screens, scale down proportionally
    // Remove Tailwind padding classes (p-6, md:p-8) to use explicit padding that matches print exactly
    cvPreviewElement.className = 'cv-preview bg-card rounded-lg border border-border shadow-lg print:shadow-none print:rounded-none print:border-0 print:m-0 print:bg-white';
    const screenWidth = window.innerWidth;
    // let previewWidth = 612;
    // let previewHeight = 792;
    
    // Scale down on smaller screens (with some padding)
    // if (screenWidth < 700) {
    //     previewWidth = Math.min(612, screenWidth - 32); // 32px for padding
    //     previewHeight = (previewWidth / 612) * 792; // Maintain aspect ratio
    // }
    
    // Use exact same dimensions and padding as print container (24px = 612px width) to ensure consistency
    cvPreviewElement.style.cssText = `
        margin: 0 auto;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        box-sizing: border-box !important;
    `;
}

// Helper function to apply Figma template styles
function applyFigmaPreviewStyles(cvPreviewElement) {
    cvPreviewElement.className = 'cv-preview print:shadow-none print:rounded-none print:border-0 print:p-6 print:m-0 print:bg-white';
    cvPreviewElement.style.cssText = 'padding: 0 !important; margin: 0 !important; max-width: 612px !important; width: 100% !important; min-height: 792px !important; height: auto !important; overflow: visible !important; background-color: transparent !important; border: none !important; border-radius: 0 !important; box-shadow: none !important; display: block !important;';
}

// Helper function to generate Figma template preview HTML
function generateFigmaPreviewHTML(populatedHTML) {
    const styleMatch = populatedHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    const styles = styleMatch ? styleMatch.map(s => {
        const contentMatch = s.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        return contentMatch ? contentMatch[1] : '';
    }).join('\n') : '';
    const bodyMatch = populatedHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const body = bodyMatch ? bodyMatch[1] : populatedHTML;
    
    return `<style>${styles}
        /* Override original body overflow hidden for preview */
        body {
            overflow: visible !important;
            height: auto !important;
        }
        #cvPreview .figma-body-wrapper {
            font-family: 'Poppins', sans-serif;
            background: white;
            color: #000;
            width: 100%;
            max-width: 612px;
            min-height: 792px;
            height: auto !important;
            display: flex;
            flex-direction: row;
            overflow: visible !important;
            margin: 0 auto;
            padding: 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        #cvPreview .figma-body-wrapper .sidebar {
            flex-shrink: 0;
            width: 210px;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
        }
        #cvPreview .figma-body-wrapper .main-content {
            flex: 1;
            min-width: 0;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
        }
        @media (max-width: 640px) {
            #cvPreview .figma-body-wrapper {
                flex-direction: column;
                max-width: 100%;
            }
            #cvPreview .figma-body-wrapper .sidebar {
                width: 100%;
            }
        }
        @media print {
            #cvPreview .figma-body-wrapper {
                width: 612px !important;
                height: 792px !important;
                overflow: hidden !important;
                box-shadow: none;
                flex-direction: row;
            }
            #cvPreview .figma-body-wrapper .sidebar,
            #cvPreview .figma-body-wrapper .main-content {
                overflow: hidden !important;
            }
        }
    </style><div class="figma-body-wrapper">${body}</div>`;
}

// Fallback function for when template loading fails


// Hide preview and show form
function hidePreview() {
    // Reset preview container styles
    const cvPreviewElement = document.getElementById('cvPreview');
    resetPreviewStyles(cvPreviewElement);
    
    document.getElementById('cvPreviewSection').classList.add('hidden');
    document.getElementById('cvForm').classList.remove('hidden');
    document.getElementById('cvForm').scrollIntoView({ behavior: 'smooth' });
}

// Print CV using template files
function printCV() {
    // Use template-based printing with printElements method
    printCVWithTemplate();
}

// Template registry - stores loaded template functions and their types
const templateRegistry = {};

// Load template JavaScript file dynamically (HTML templates)
function loadTemplateJS(templateName) {
    return new Promise((resolve, reject) => {
        // Check if template is already loaded
        if (templateRegistry[templateName] && templateRegistry[templateName].func) {
            resolve(templateRegistry[templateName].func);
            return;
        }

        // Determine the correct path based on current location
        // If we're in template/ directory, go up one level
        const isInTemplateDir = window.location.pathname.includes('/template/');
        const templatePath = isInTemplateDir ? `../templates/${templateName}.js` : `templates/${templateName}.js`;

        // Create script element to load template
        const script = document.createElement('script');
        script.src = templatePath;
        script.onload = () => {
            // Get the template function based on template name
            let templateFunction = null;
            // Future: add HTML template functions here if needed
            
            if (templateFunction) {
                templateRegistry[templateName] = { func: templateFunction, type: 'html' };
                resolve(templateFunction);
            } else {
                reject(new Error(`Template function not found for: ${templateName}`));
            }
        };
        script.onerror = () => {
            reject(new Error(`Failed to load template: ${templateName}`));
        };
        document.head.appendChild(script);
    });
}

// Load template (HTML templates only)
async function loadTemplate(templateName) {
    try {
        // Try to load HTML template
        const templateFunction = await loadTemplateJS(templateName);
        const htmlContent = templateFunction();
        return { type: 'html', content: htmlContent };
    } catch (error) {
        console.error('Error loading template:', error);
        return null;
    }
}

// Generate HTML for education section (for template)
function generateEducationHTML(entries) {
    if (!entries || entries.length === 0) return '';
    
    let html = '';
    entries.forEach(entry => {
        // Only add entry if required fields are set
        if (!entry.university || !entry.university.trim() || !entry.degree || !entry.degree.trim()) {
            return; // Skip this entry
        }
        
        html += '<div class="cv-entry">';
        html += `<div class="cv-entry-title">${escapeHtml(entry.university)}</div>`;
        if (entry.city && entry.city.trim()) {
            html += `<div class="cv-entry-location">${escapeHtml(entry.city)}</div>`;
        }
        let degree = escapeHtml(entry.degree);
        if (entry.gpa && entry.gpa.trim()) {
            degree += `, GPA: ${escapeHtml(entry.gpa)}`;
        }
        html += `<div class="cv-entry-subtitle">${degree}</div>`;
        if (entry.date && entry.date.trim()) {
            const displayDate = formatDate(entry.date);
            html += `<div class="cv-entry-date">${escapeHtml(displayDate)}</div>`;
        }
        
        if (entry.thesis && entry.thesis.trim()) {
            html += '<ul class="cv-entry-list"><li>Thesis: "' + escapeHtml(entry.thesis) + '"</li></ul>';
        }
        html += '</div>';
    });
    
    return html;
}

// Generate HTML for experience section (for template)
function generateExperienceHTML(entries) {
    if (!entries || entries.length === 0) return '';
    
    let html = '';
    entries.forEach(entry => {
        // Only add entry if required fields are set
        if (!entry.company || !entry.company.trim() || !entry.position || !entry.position.trim()) {
            return; // Skip this entry
        }
        
        html += '<div class="cv-entry">';
        html += `<div class="cv-entry-title">${escapeHtml(entry.company)}</div>`;
        if (entry.city && entry.city.trim()) {
            html += `<div class="cv-entry-location">${escapeHtml(entry.city)}</div>`;
        }
        html += `<div class="cv-entry-subtitle">${escapeHtml(entry.position)}</div>`;
        if (entry.date && entry.date.trim()) {
            const displayDate = formatDate(entry.date);
            html += `<div class="cv-entry-date">${escapeHtml(displayDate)}</div>`;
        }
        
        if (entry.description && entry.description.trim()) {
            const items = entry.description.split('\n').filter(line => line.trim());
            if (items.length > 0) {
                html += '<ul class="cv-entry-list">';
                items.forEach(item => {
                    html += `<li>${escapeHtml(item.trim())}</li>`;
                });
                html += '</ul>';
            }
        }
        html += '</div>';
    });
    
    return html;
}

// Generate HTML for publications (for template)
function generatePublicationsHTML(text) {
    if (!text || !text.trim()) return '';
    
    const publications = text.split('\n').filter(line => line.trim());
    if (publications.length === 0) return '';
    
    let html = '<div>';
    publications.forEach(pub => {
        html += `<div style="margin-bottom: 8px; font-size: 0.875rem;">${escapeHtml(pub.trim())}.</div>`;
    });
    html += '</div>';
    return html;
}

// Generate HTML for skills (for template)
function generateSkillsHTML(text) {
    if (!text || !text.trim()) return '';
    
    const skills = text.split('\n').filter(line => line.trim());
    if (skills.length === 0) return '';
    
    let html = '<ul class="cv-entry-list">';
    skills.forEach(skill => {
        html += `<li><strong>${escapeHtml(skill.trim())}</strong></li>`;
    });
    html += '</ul>';
    return html;
}

// Generate HTML for languages (for template)
function generateLanguagesHTML(entries) {
    if (!entries || entries.length === 0) return '';
    
    let html = '<ul class="cv-entry-list">';
    let hasValidEntries = false;
    entries.forEach(entry => {
        // Only add if name is set
        if (!entry.name || !entry.name.trim()) {
            return; // Skip this entry
        }
        hasValidEntries = true;
        let line = `<li><strong>${escapeHtml(entry.name)}:</strong>`;
        if (entry.level && entry.level.trim()) {
            line += ` ${escapeHtml(entry.level)}`;
        }
        line += '</li>';
        html += line;
    });
    html += '</ul>';
    return hasValidEntries ? html : '';
}

// Generate HTML for projects (for template)
function generateProjectsHTML(entries) {
    if (!entries || entries.length === 0) return '';
    
    let html = '';
    entries.forEach(entry => {
        // Only add entry if required fields are set
        if (!entry.title || !entry.title.trim() || !entry.description || !entry.description.trim()) {
            return; // Skip this entry
        }
        
        html += '<div class="cv-entry">';
        html += `<div class="cv-entry-title">${escapeHtml(entry.title)}</div>`;
        if (entry.tech && entry.tech.trim()) {
            html += `<div class="cv-entry-date">${escapeHtml(entry.tech)}</div>`;
        }
        html += `<div style="font-size: 0.875rem; margin-top: 4px;">${escapeHtml(entry.description)}</div>`;
        html += '</div>';
    });
    
    return html;
}

// Generate HTML for awards (for template)
function generateAwardsHTML(text) {
    if (!text || !text.trim()) return '';
    
    const awards = text.split('\n').filter(line => line.trim());
    if (awards.length === 0) return '';
    
    let html = '<ul class="cv-entry-list">';
    awards.forEach(award => {
        html += `<li style="font-size: 0.875rem; margin-bottom: 4px;">${escapeHtml(award.trim())}</li>`;
    });
    html += '</ul>';
    return html;
}

// Generate HTML for Figma template skills
function generateFigmaSkillsHTML(text) {
    if (!text || !text.trim()) return '';
    const skills = text.split('\n').filter(line => line.trim());
    if (skills.length === 0) return '';
    let html = '';
    skills.forEach(skill => {
        html += `<li>${escapeHtml(skill.trim())}</li>`;
    });
    return html;
}

// Generate HTML for Figma template hobbies
function generateFigmaHobbiesHTML(text) {
    if (!text || !text.trim()) return '';
    const hobbies = text.split('\n').filter(line => line.trim());
    if (hobbies.length === 0) return '';
    let html = '';
    hobbies.forEach(hobby => {
        html += `<li>${escapeHtml(hobby.trim())}</li>`;
    });
    return html;
}

// Generate HTML for Figma template awards
function generateFigmaAwardsHTML(text) {
    if (!text || !text.trim()) return '';
    const awards = text.split('\n').filter(line => line.trim());
    if (awards.length === 0) return '';
    let html = '';
    awards.forEach(award => {
        // Try to parse "Award Name ..... Year" format
        const parts = award.split('.....');
        const awardName = parts[0]?.trim() || award.trim();
        const year = parts[1]?.trim() || '';
        html += `<div class="award-item">
            <div class="award-header">
                <span class="award-title">${escapeHtml(awardName)}</span>
                ${year ? `<span class="award-year">${escapeHtml(year)}</span>` : ''}
            </div>
        </div>`;
    });
    return html;
}

// Generate HTML for Figma template links
function generateFigmaLinksHTML(data) {
    const links = [];
    
    if (data.linkedin && data.linkedin.trim()) {
        const url = data.linkedin.startsWith('http') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`;
        links.push({ name: 'Linkedin', url: url });
    }
    if (data.github && data.github.trim()) {
        const url = data.github.startsWith('http') ? data.github : `https://${data.github}`;
        links.push({ name: 'Github', url: url });
    }
    if (data.dribbble && data.dribbble.trim()) {
        const url = data.dribbble.startsWith('http') ? data.dribbble : `https://${data.dribbble}`;
        links.push({ name: 'Dribbble', url: url });
    }
    if (data.instagram && data.instagram.trim()) {
        const url = data.instagram.startsWith('http') ? data.instagram : `https://${data.instagram}`;
        links.push({ name: 'Instagram', url: url });
    }
    if (data.website && data.website.trim()) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        links.push({ name: 'Website', url: url });
    }
    
    if (links.length === 0) return '';
    
    let html = '<div class="link-row">';
    links.forEach((link, index) => {
        if (index > 0 && index % 2 === 0) {
            html += '</div><div class="link-row">';
        }
        html += `<div class="link-item">
            <a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.name)}</a>
        </div>`;
    });
    
    html += '</div>';
    return html;
}

// Generate HTML for Figma template education (timeline format)
function generateFigmaEducationHTML(entries) {
    if (!entries || entries.length === 0) return '';
    let html = '';
    entries.forEach(entry => {
        // Only add entry if required fields are set
        if (!entry.university || !entry.university.trim() || !entry.degree || !entry.degree.trim()) {
            return; // Skip this entry
        }
        
        html += `<div class="timeline-item">
            ${entry.date && entry.date.trim() ? `<div class="timeline-date">${escapeHtml(formatDate(entry.date))}</div>` : '<div class="timeline-date"></div>'}
            <div class="timeline-content">
                <div class="timeline-icon"></div>
                <div class="timeline-details">
                    <div class="timeline-title">${escapeHtml(entry.university)}</div>
                    <div class="timeline-subtitle">${escapeHtml(entry.degree)}</div>
                    ${entry.thesis && entry.thesis.trim() ? `<div class="timeline-description">${escapeHtml(entry.thesis)}</div>` : ''}
                </div>
            </div>
        </div>`;
    });
    return html;
}

// Generate HTML for Figma template experience (timeline format)
function generateFigmaExperienceHTML(entries) {
    if (!entries || entries.length === 0) return '';
    let html = '';
    entries.forEach(entry => {
        // Only add entry if required fields are set
        if (!entry.company || !entry.company.trim() || !entry.position || !entry.position.trim()) {
            return; // Skip this entry
        }
        
        const dateStr = entry.date && entry.date.trim() ? escapeHtml(formatDate(entry.date)) : '';
        html += `<div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-icon"></div>
                <div class="timeline-details">
                    <div class="timeline-title">${escapeHtml(entry.company)}</div>
                    <div class="timeline-meta">
                        <span>${escapeHtml(entry.position)}</span>
                        ${dateStr ? `<span>|</span><span>${dateStr}</span>` : ''}
                    </div>
                    ${entry.description && entry.description.trim() ? `<div class="timeline-description">${escapeHtml(entry.description)}</div>` : ''}
                </div>
            </div>
        </div>`;
    });
    return html;
}

// Generate HTML for Figma template volunteer (timeline format)
function generateFigmaVolunteerHTML(entries) {
    if (!entries || entries.length === 0) return '';
    let html = '';
    entries.forEach(entry => {
        // Only add entry if required fields are set
        if (!entry.organization || !entry.organization.trim() || !entry.position || !entry.position.trim() || !entry.description || !entry.description.trim()) {
            return; // Skip this entry
        }
        
        const dateStr = entry.date && entry.date.trim() ? escapeHtml(formatDate(entry.date)) : '';
        html += `<div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-icon"></div>
                <div class="timeline-details">
                    <div class="timeline-title">${escapeHtml(entry.organization)}</div>
                    <div class="timeline-meta">
                        <span>${escapeHtml(entry.position)}</span>
                        ${dateStr ? `<span>|</span><span>${dateStr}</span>` : ''}
                    </div>
                    <div class="timeline-description">${escapeHtml(entry.description)}</div>
                </div>
            </div>
        </div>`;
    });
    return html;
}

// Populate template with data (HTML templates only)
function populateTemplate(templateData, data) {
    // Treat as HTML template (could be object with content or direct string)
    let html = templateData;
    if (templateData && typeof templateData === 'object' && templateData.content) {
        html = templateData.content;
    }
    const template = data.template || 'classic';
    
    // Handle conditional sections FIRST (before replacing placeholders inside them)
    // This ensures we only process placeholders in sections that will be kept
    html = html.replace(/\{\{#if title\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        return (data.title && data.title.trim()) ? content : '';
    });
    html = html.replace(/\{\{#if about\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        return (data.about && data.about.trim()) ? content : '';
    });
    html = html.replace(/\{\{#if birthdate\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        return (data.birthdate && data.birthdate.trim()) ? content : '';
    });
    html = html.replace(/\{\{#if cityOfBirth\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        return (data.cityOfBirth && data.cityOfBirth.trim()) ? content : '';
    });
    html = html.replace(/\{\{#if phone\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        return (data.phone && data.phone.trim()) ? content : '';
    });
    html = html.replace(/\{\{#if location\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        return (data.location && data.location.trim()) ? content : '';
    });
    html = html.replace(/\{\{#if email\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        // Replace email placeholder inside the conditional block before returning
        const processedContent = (data.email && data.email.trim()) 
            ? content.replace(/\{\{email\}\}/g, escapeHtml(data.email)) 
            : '';
        return processedContent;
    });
    
    // Now replace all other basic placeholders (after conditionals are processed)
    html = html.replace(/\{\{name\}\}/g, escapeHtml(data.name || ''));
    html = html.replace(/\{\{title\}\}/g, escapeHtml(data.title || ''));
    html = html.replace(/\{\{phone\}\}/g, escapeHtml(data.phone || ''));
    html = html.replace(/\{\{email\}\}/g, escapeHtml(data.email || '')); // Also replace any remaining email placeholders
    html = html.replace(/\{\{birthdate\}\}/g, escapeHtml(data.birthdate || ''));
    html = html.replace(/\{\{cityOfBirth\}\}/g, escapeHtml(data.cityOfBirth || ''));
    html = html.replace(/\{\{location\}\}/g, escapeHtml(data.location || ''));
    html = html.replace(/\{\{about\}\}/g, escapeHtml(data.about || ''));
    html = html.replace(/\{\{contactInfo\}\}/g, generateContactInfo(data));
    
    // Replace section placeholders - use Figma-specific generators for figma template
    if (template === 'figma') {
        html = html.replace(/\{\{education\}\}/g, generateFigmaEducationHTML(data.education || []));
        html = html.replace(/\{\{experience\}\}/g, generateFigmaExperienceHTML(data.experience || []));
        html = html.replace(/\{\{volunteer\}\}/g, generateFigmaVolunteerHTML(data.volunteer || []));
        html = html.replace(/\{\{skills\}\}/g, generateFigmaSkillsHTML(data.skills || ''));
        html = html.replace(/\{\{hobbies\}\}/g, generateFigmaHobbiesHTML(data.hobbies || ''));
        html = html.replace(/\{\{awards\}\}/g, generateFigmaAwardsHTML(data.awards || ''));
        html = html.replace(/\{\{links\}\}/g, generateFigmaLinksHTML(data));
    } else {
        html = html.replace(/\{\{education\}\}/g, generateEducationHTML(data.education || []));
        html = html.replace(/\{\{experience\}\}/g, generateExperienceHTML(data.experience || []));
        html = html.replace(/\{\{publications\}\}/g, generatePublicationsHTML(data.publications || ''));
        html = html.replace(/\{\{skills\}\}/g, generateSkillsHTML(data.skills || ''));
        html = html.replace(/\{\{languages\}\}/g, generateLanguagesHTML(data.languages || []));
        html = html.replace(/\{\{projects\}\}/g, generateProjectsHTML(data.projects || []));
        html = html.replace(/\{\{awards\}\}/g, generateAwardsHTML(data.awards || ''));
    }
    
    // Handle remaining conditional sections
    html = html.replace(/\{\{#if publications\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const pubContent = generatePublicationsHTML(data.publications || '');
        return pubContent && pubContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if skills\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const skillsContent = generateSkillsHTML(data.skills || '');
        return skillsContent && skillsContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if languages\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const langContent = generateLanguagesHTML(data.languages || []);
        return langContent && langContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if projects\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const projContent = generateProjectsHTML(data.projects || []);
        return projContent && projContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if awards\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const awardsContent = generateAwardsHTML(data.awards || '');
        return awardsContent && awardsContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if education\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const eduContent = generateEducationHTML(data.education || []);
        return eduContent && eduContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if experience\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const expContent = generateExperienceHTML(data.experience || []);
        return expContent && expContent.trim() ? content : '';
    });
    html = html.replace(/\{\{#if contactInfo\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
        const contactContent = generateContactInfo(data);
        return contactContent && contactContent.trim() ? content : '';
    });
    
    return html;
}

// Extract body content from full HTML template
function extractBodyContent(fullHTML) {
    // Try to extract body content
    const bodyMatch = fullHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        return bodyMatch[1];
    }
    // If no body tag, return the whole HTML (might be just body content)
    return fullHTML;
}

// Extract styles from template HTML
function extractStyles(fullHTML) {
    const styleMatch = fullHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatch) {
        return styleMatch.map(style => {
            const contentMatch = style.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            return contentMatch ? contentMatch[1] : '';
        }).join('\n');
    }
    return '';
}

// Print selected elements using the method from:
// https://medium.com/@aszepeshazi/printing-selected-elements-on-a-web-page-from-javascript-a878ac873828
function printElements(elements) {
    // Clear previous print-specific classes
    document.querySelectorAll('.pe-preserve-print, .pe-no-print, .pe-preserve-ancestor').forEach(el => {
        el.classList.remove('pe-preserve-print', 'pe-no-print', 'pe-preserve-ancestor');
    });

    // Convert NodeList or single element to array
    const elementsArray = Array.isArray(elements) ? elements : 
                         elements instanceof NodeList ? Array.from(elements) : 
                         [elements];

    elementsArray.forEach(element => {
        if (!element) return;
        
        let current = element;
        // Traverse up the DOM tree to body
        while (current && current !== document.body) {
            current.classList.add('pe-preserve-print');
            
            // Hide siblings that aren't marked for preservation
            if (current.parentNode) {
                Array.from(current.parentNode.children).forEach(sibling => {
                    if (sibling !== current && !sibling.classList.contains('pe-preserve-print')) {
                        sibling.classList.add('pe-no-print');
                    }
                });
            }
            
            current = current.parentNode;
        }
    });

    // Apply the preserve-ancestor class to ancestors
    document.querySelectorAll('.pe-preserve-print').forEach(el => {
        let ancestor = el.parentNode;
        while (ancestor && ancestor !== document.body) {
            ancestor.classList.add('pe-preserve-ancestor');
            ancestor = ancestor.parentNode;
        }
    });

    // Trigger the print dialog
    window.print();
    
    // Clean up classes after print dialog is closed (with a delay to ensure print completes)
    setTimeout(() => {
        document.querySelectorAll('.pe-preserve-print, .pe-no-print, .pe-preserve-ancestor').forEach(el => {
            el.classList.remove('pe-preserve-print', 'pe-no-print', 'pe-preserve-ancestor');
        });
    }, 1000);
}

// Print CV using template HTML files with the print elements method
async function printCVWithTemplate() {
    const data = collectFormData();
    const template = data.template || 'classic';
    
    // Debug: Log the selected template
    console.log('Printing with template:', template);
    
    try {
        // Load the template
        const templateHTML = await loadTemplate(template);
        
        if (!templateHTML) {
            // Fallback to browser print if template loading fails
            console.warn('Template loading failed, using browser print');
            window.print();
            return;
        }
        
        // Populate template with data
        const populatedHTML = populateTemplate(templateHTML, data);
        
        // Extract body content and styles
        const bodyContent = extractBodyContent(populatedHTML);
        const templateStyles = extractStyles(populatedHTML);
        
        // Create a temporary container with styles included
        // Use US Letter width (612px at 72 DPI) for proper page sizing
        // Match preview exactly: same width, padding, and styling
        const tempContainer = document.createElement('div');
        tempContainer.id = 'tempPrintContainer';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.margin = '0 auto';
        tempContainer.style.padding = '24px'; // Match preview padding
        tempContainer.style.background = 'white';
        tempContainer.style.color = '#000';
        tempContainer.style.fontFamily = template === 'classic' 
            ? "'Latin Modern Roman', 'Computer Modern', 'Times New Roman', 'Times', serif" 
            : 'inherit';
        
        // Create full HTML structure with style tag and content
        // Use the EXACT same styles function as preview to ensure 100% match
        const templateFontStyles = template === 'classic' ? getJakesResumeStyles() : '';
        const printBreakStyles = getSharedCVStyles(template, templateStyles, templateFontStyles, '#tempPrintContainer');
        tempContainer.innerHTML = `${printBreakStyles}${bodyContent}`;
        
        // Append to body (off-screen)
        document.body.appendChild(tempContainer);
        
        // Wait for DOM to update and styles to apply
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Use the printElements method to print only the temporary container
        printElements(tempContainer);
        
        // Clean up temporary container after print dialog is closed
        setTimeout(() => {
            const container = document.getElementById('tempPrintContainer');
            if (container) {
                document.body.removeChild(container);
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error in printCVWithTemplate:', error);
        // Clean up on error
        const container = document.getElementById('tempPrintContainer');
        if (container) {
            document.body.removeChild(container);
        }
        alert('Error generating print preview. Using browser print instead.');
        window.print();
    }
}


// Add/Remove functions for dynamic entries
function addEducation() {
    const container = document.getElementById('educationContainer');
    const entry = document.createElement('div');
    entry.className = 'rounded-lg border border-border bg-muted/50 p-4 space-y-4';
    entry.innerHTML = `
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">University Name <span class="text-destructive">*</span></label>
            <input type="text" class="edu-university flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="University Name">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">City, Country (or ISO code)</label>
            <input type="text" class="edu-city flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g., Jakarta, ID or Jakarta, Indonesia">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Degree/Program <span class="text-destructive">*</span></label>
            <input type="text" class="edu-degree flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="Ph.D. in Area Name, Advisor: Sample Person">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">GPA (optional)</label>
            <input type="text" class="edu-gpa flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="3.50 / 4.00">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Date Range</label>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">Start Date</label>
                    <input type="date" class="edu-date-start flex flex-col justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">End Date (leave empty for "Present")</label>
                    <input type="date" class="edu-date-end flex flex-col justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
            </div>
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Thesis (optional)</label>
            <input type="text" class="edu-thesis flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Title of The Thesis">
        </div>
        <button type="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onclick="removeEducation(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeEducation(btn) {
    btn.closest('div').remove();
}

function addExperience() {
    const container = document.getElementById('experienceContainer');
    const entry = document.createElement('div');
    entry.className = 'rounded-lg border border-border bg-muted/50 p-4 space-y-4';
    entry.innerHTML = `
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Company/University Name <span class="text-destructive">*</span></label>
            <input type="text" class="exp-company flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="Company Name">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">City, Country (or ISO code)</label>
            <input type="text" class="exp-city flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g., Jakarta, ID or Jakarta, Indonesia">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Position <span class="text-destructive">*</span></label>
            <input type="text" class="exp-position flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="Position at Group/Laboratory Name">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Date Range</label>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">Start Date</label>
                    <input type="date" class="exp-date-start flex flex-col justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">End Date (leave empty for "Present")</label>
                    <input type="date" class="exp-date-end flex flex-col justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
            </div>
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Description (one per line) <span class="text-destructive">*</span></label>
            <textarea class="exp-description flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows="3" required placeholder="Title of the project&#10;A more detailed explanation"></textarea>
        </div>
        <button type="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onclick="removeExperience(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeExperience(btn) {
    btn.closest('div').remove();
}

function addLanguage() {
    const container = document.getElementById('languagesContainer');
    const entry = document.createElement('div');
    entry.className = 'rounded-lg border border-border bg-muted/50 p-4 space-y-4';
    entry.innerHTML = `
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Language <span class="text-destructive">*</span></label>
            <input type="text" class="lang-name flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="English">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Proficiency/Details</label>
            <input type="text" class="lang-level flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Native / TOEFL: 120">
        </div>
        <button type="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onclick="removeLanguage(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeLanguage(btn) {
    btn.closest('div').remove();
}

function addProject() {
    const container = document.getElementById('projectsContainer');
    const entry = document.createElement('div');
    entry.className = 'rounded-lg border border-border bg-muted/50 p-4 space-y-4';
    entry.innerHTML = `
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Project Title <span class="text-destructive">*</span></label>
            <input type="text" class="proj-title flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="Project Title">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Technology/Year</label>
            <input type="text" class="proj-tech flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Technology Used, 2019">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Description <span class="text-destructive">*</span></label>
            <textarea class="proj-description flex min-h-[64px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows="2" required placeholder="Short explanation of the project"></textarea>
        </div>
        <button type="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onclick="removeProject(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeProject(btn) {
    btn.closest('div').remove();
}

// Add volunteer experience entry
function addVolunteer() {
    const container = document.getElementById('volunteerContainer');
    const entry = document.createElement('div');
    entry.className = 'rounded-lg border border-border bg-muted/50 p-4 space-y-4';
    entry.innerHTML = `
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Organization Name <span class="text-destructive">*</span></label>
            <input type="text" class="vol-organization flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="Organization Name">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Position/Role <span class="text-destructive">*</span></label>
            <input type="text" class="vol-position flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required placeholder="Volunteer Role">
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Date Range</label>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">Start Date</label>
                    <input type="month" class="vol-date-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">End Date (leave empty for "Present")</label>
                    <input type="month" class="vol-date-end flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
            </div>
        </div>
        <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Description (one per line) <span class="text-destructive">*</span></label>
            <textarea class="vol-description flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows="3" required placeholder="Description of your volunteer work"></textarea>
        </div>
        <button type="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onclick="removeVolunteer(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeVolunteer(btn) {
    btn.closest('div').remove();
}

// Save form data as JSON
function saveAsJSON() {
    const data = collectFormData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Load JSON file input handler
function loadFromJSON() {
    document.getElementById('jsonFileInput').click();
}

// Handle JSON file selection and load data
function handleJSONFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            loadFormData(data);
            alert('CV data loaded successfully!');
        } catch (error) {
            alert('Error loading JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again
    event.target.value = '';
}

// Load form data from JSON object
function loadFormData(data) {
    // Load template selection
    if (data.template) {
        const templateRadio = document.querySelector(`input[name="template"][value="${data.template}"]`);
        if (templateRadio) {
            templateRadio.checked = true;
        }
    }
    
    // Load personal information
    if (data.name) document.getElementById('name').value = data.name;
    
    // Load photo if available
    if (data.photo) {
        const photoInput = document.getElementById('photo');
        const preview = document.getElementById('photoPreview');
        const previewImg = document.getElementById('photoPreviewImg');
        if (photoInput && preview && previewImg) {
            photoInput.setAttribute('data-photo', data.photo);
            previewImg.src = data.photo;
            preview.classList.remove('hidden');
        }
    }
    
    if (data.title && document.getElementById('title')) document.getElementById('title').value = data.title;
    if (data.phone && document.getElementById('phone')) document.getElementById('phone').value = data.phone;
    if (data.birthdate && document.getElementById('birthdate')) document.getElementById('birthdate').value = data.birthdate;
    if (data.cityOfBirth && document.getElementById('cityOfBirth')) document.getElementById('cityOfBirth').value = data.cityOfBirth;
    if (data.location && document.getElementById('location')) document.getElementById('location').value = data.location;
    if (data.website) document.getElementById('website').value = data.website;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
    if (data.github) document.getElementById('github').value = data.github;
    if (data.dribbble && document.getElementById('dribbble')) document.getElementById('dribbble').value = data.dribbble;
    if (data.instagram && document.getElementById('instagram')) document.getElementById('instagram').value = data.instagram;
    if (data.about && document.getElementById('about')) document.getElementById('about').value = data.about;
    if (data.hobbies && document.getElementById('hobbies')) document.getElementById('hobbies').value = data.hobbies;
    
    // Load publications
    if (data.publications) document.getElementById('publications').value = data.publications;
    
    // Load skills
    if (data.skills) document.getElementById('skills').value = data.skills;
    
    // Load awards
    if (data.awards) document.getElementById('awards').value = data.awards;
    
    // Load education entries
    const educationContainer = document.getElementById('educationContainer');
    educationContainer.innerHTML = '';
    if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
            addEducation();
            const entry = educationContainer.lastElementChild;
            entry.querySelector('.edu-university').value = edu.university || '';
            entry.querySelector('.edu-city').value = edu.city || '';
            entry.querySelector('.edu-degree').value = edu.degree || '';
            entry.querySelector('.edu-gpa').value = edu.gpa || '';
            // Handle new date format (dateStart/dateEnd) or old format (date)
            if (edu.dateStart) {
                entry.querySelector('.edu-date-start').value = edu.dateStart || '';
            }
            if (edu.dateEnd) {
                entry.querySelector('.edu-date-end').value = edu.dateEnd || '';
            }
            // Fallback for old JSON format
            if (edu.date && !edu.dateStart && !edu.dateEnd) {
                // Try to parse old date format if needed
                // For now, just leave it empty and user can re-enter
            }
            entry.querySelector('.edu-thesis').value = edu.thesis || '';
        });
    }
    // Don't add empty entry if no data - form starts empty
    
    // Load experience entries
    const experienceContainer = document.getElementById('experienceContainer');
    experienceContainer.innerHTML = '';
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
            addExperience();
            const entry = experienceContainer.lastElementChild;
            entry.querySelector('.exp-company').value = exp.company || '';
            entry.querySelector('.exp-city').value = exp.city || '';
            entry.querySelector('.exp-position').value = exp.position || '';
            // Handle new date format (dateStart/dateEnd) or old format (date)
            if (exp.dateStart) {
                entry.querySelector('.exp-date-start').value = exp.dateStart || '';
            }
            if (exp.dateEnd) {
                entry.querySelector('.exp-date-end').value = exp.dateEnd || '';
            }
            // Fallback for old JSON format
            if (exp.date && !exp.dateStart && !exp.dateEnd) {
                // Try to parse old date format if needed
                // For now, just leave it empty and user can re-enter
            }
            entry.querySelector('.exp-description').value = exp.description || '';
        });
    }
    // Don't add empty entry if no data - form starts empty
    
    // Load language entries
    const languagesContainer = document.getElementById('languagesContainer');
    languagesContainer.innerHTML = '';
    if (data.languages && data.languages.length > 0) {
        data.languages.forEach(lang => {
            addLanguage();
            const entry = languagesContainer.lastElementChild;
            entry.querySelector('.lang-name').value = lang.name || '';
            entry.querySelector('.lang-level').value = lang.level || '';
        });
    }
    // Don't add empty entry if no data - form starts empty
    
    // Load volunteer entries
    const volunteerContainer = document.getElementById('volunteerContainer');
    if (volunteerContainer) {
        volunteerContainer.innerHTML = '';
        if (data.volunteer && data.volunteer.length > 0) {
            data.volunteer.forEach(vol => {
                addVolunteer();
                const entry = volunteerContainer.lastElementChild;
                entry.querySelector('.vol-organization').value = vol.organization || '';
                entry.querySelector('.vol-position').value = vol.position || '';
                if (vol.dateStart) {
                    entry.querySelector('.vol-date-start').value = vol.dateStart || '';
                }
                if (vol.dateEnd) {
                    entry.querySelector('.vol-date-end').value = vol.dateEnd || '';
                }
                entry.querySelector('.vol-description').value = vol.description || '';
            });
        }
        // Don't add empty entry if no data - form starts empty
    }
    
    // Load project entries
    const projectsContainer = document.getElementById('projectsContainer');
    projectsContainer.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
            addProject();
            const entry = projectsContainer.lastElementChild;
            entry.querySelector('.proj-title').value = proj.title || '';
            entry.querySelector('.proj-tech').value = proj.tech || '';
            entry.querySelector('.proj-description').value = proj.description || '';
        });
    }
    // Don't add empty entry if no data - form starts empty
    
}

// Get Jake's Resume specific styles
function getJakesResumeStyles() {
    return `font-family: 'Latin Modern Roman', 'Computer Modern', 'Times New Roman', 'Times', serif;`;
}

// Get shared CV styles for preview and print
function getSharedCVStyles(template, templateStyles, templateFontStyles, containerSelector) {
    let styles = '';
    
    // Add font import for classic template
    if (template === 'classic') {
        styles += `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Latin+Modern+Roman:wght@400;700&display=swap">`;
    }
    
    if (template === 'classic' && templateFontStyles) {
        styles += `<style>${containerSelector} { ${templateFontStyles} }</style>`;
    }
    
    if (templateStyles) {
        styles += `<style>${templateStyles}</style>`;
    }
    
    // Add print-specific styles
    styles += `
    <style>
        @media print {
            ${containerSelector} {
                padding: 24px !important;
                margin: 0 auto !important;
                background: white !important;
                color: #000 !important;
            }
        }
    </style>
    `;
    
    return styles;
}
