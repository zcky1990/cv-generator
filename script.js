// Collect form data
function collectFormData() {
    const selectedTemplate = document.querySelector('input[name="template"]:checked')?.value || 'classic';
    const data = {
        template: selectedTemplate,
        name: document.getElementById('name').value,
        title: document.getElementById('title')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        birthdate: document.getElementById('birthdate')?.value || '',
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
    
    // Left column content (blue sidebar) - using table layout for better PDF compatibility
    // Use fixed height for PDF (11in = letter size height) and 100vh for screen
    let leftColumn = '<div id="luxsleek-left-column" style="width: 33%; min-height: 100vh; height: 279.4mm; display: table-cell; vertical-align: top; box-sizing: border-box; background-color: #304263; background: #304263; color: white; padding: 24px; font-family: Calibri, Arial, sans-serif; font-size: 12px; position: relative; visibility: visible; opacity: 1;">';
    
    // Name
    const nameParts = data.name.split(' ');
    const lastName = nameParts.pop() || '';
    const firstName = nameParts.join(' ');
    leftColumn += `<div style="margin-bottom: 16px;"><h1 style="font-size: 18px; font-weight: bold; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">${escapeHtml(firstName)} <span>${escapeHtml(lastName)}</span></h1></div>`;
    
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
    if (data.location) {
        leftColumn += `<div style="margin-bottom: 4px;">${escapeHtml(data.location)}</div>`;
    }
    leftColumn += '</div></div>';
    
    // Personal Information
    leftColumn += '<div style="margin-bottom: 24px;">';
    leftColumn += '<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.3); font-family: Calibri, Arial, sans-serif;">Personal Information</h2>';
    leftColumn += '<div style="font-size: 12px; font-family: Calibri, Arial, sans-serif;">';
    if (data.birthdate) {
        leftColumn += `<div style="margin-bottom: 4px;">Year of birth: <strong>${escapeHtml(data.birthdate.split('-')[0])}</strong></div>`;
    }
    if (data.languages && data.languages.length > 0) {
        const langList = data.languages.map(l => `<strong>${escapeHtml(l.name)}</strong>${l.level ? ` (${escapeHtml(l.level)})` : ''}`).join(', ');
        leftColumn += `<div style="margin-bottom: 4px;">Languages: ${langList}</div>`;
    }
    leftColumn += '</div></div>';
    
    // Skills
    if (data.skills && data.skills.trim()) {
        leftColumn += '<div style="margin-bottom: 24px;">';
        leftColumn += '<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.3); font-family: Calibri, Arial, sans-serif;">Skills</h2>';
        leftColumn += '<ul style="font-size: 12px; list-style: none; padding-left: 0; margin: 0; font-family: Calibri, Arial, sans-serif;">';
        data.skills.split('\n').filter(line => line.trim()).forEach(skill => {
            leftColumn += `<li style="margin-bottom: 4px;">• ${escapeHtml(skill.trim())}</li>`;
        });
        leftColumn += '</ul></div>';
    }
    
    leftColumn += '</div>';
    
    // Right column content (white area) - using table layout for better PDF compatibility
    let rightColumn = '<div id="luxsleek-right-column" style="width: 67%; display: table-cell; vertical-align: top; box-sizing: border-box; background-color: white; color: black; padding: 24px; font-family: Calibri, Arial, sans-serif; font-size: 12px; position: relative; visibility: visible; opacity: 1;">';
    
    // Experience
    if (data.experience && data.experience.length > 0) {
        rightColumn += '<div style="margin-bottom: 24px;">';
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Experience</h2>';
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
        rightColumn += '<div style="margin-bottom: 24px;">';
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Education</h2>';
        data.education.forEach(entry => {
            rightColumn += '<div style="margin-bottom: 16px;">';
            const dateStr = formatDateForLuxSleek(entry.dateStart, entry.dateEnd);
            rightColumn += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;">`;
            rightColumn += `<div style="flex: 1; font-size: 12px;"><span style="font-weight: bold; text-transform: uppercase;">${escapeHtml(entry.degree)}</span>. <em>${escapeHtml(entry.university)}${entry.city ? ` (${escapeHtml(entry.city)})` : ''}</em>.</div>`;
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
        rightColumn += '<div style="margin-bottom: 24px;">';
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Projects</h2>';
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
    
    // Hobbies
    if (data.hobbies && data.hobbies.trim()) {
        rightColumn += '<div style="margin-bottom: 24px;">';
        rightColumn += '<h2 style="font-size: 16px; font-weight: bold; color: #304263; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 2px solid #304263; font-family: Calibri, Arial, sans-serif;">Hobbies</h2>';
        const hobbies = data.hobbies.split('\n').filter(line => line.trim());
        hobbies.forEach(hobby => {
            rightColumn += `<div style="font-size: 11px; margin-bottom: 4px; font-family: Calibri, Arial, sans-serif;"><em>${escapeHtml(hobby.trim())}</em></div>`;
        });
        rightColumn += '</div>';
    }
    
    rightColumn += '</div>';
    
    // Combine into two-column layout using table for better PDF compatibility
    // Using explicit table structure for maximum compatibility with html2pdf
    return `<div id="luxsleek-wrapper" style="width: 100%; margin: 0; padding: 0; display: table; table-layout: fixed; min-height: 100vh; font-family: Calibri, Arial, sans-serif; font-size: 12px; border-collapse: collapse;"><div style="display: table-row;">${leftColumn}${rightColumn}</div></div>`;
}

// Format date for LuxSleek template (YYYY.MM--YYYY.MM format)
function formatDateForLuxSleek(startDate, endDate) {
    if (!startDate && !endDate) return 'Present';
    
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month] = dateStr.split('-');
        return `${month || '01'}/${year}`;
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    
    if (!start) return end;
    return `${start} - ${end}`;
}

// Generate Classic CV following Northeastern University COS Faculty CV Template
// Reference: https://www.overleaf.com/latex/templates/northeastern-university-cos-faculty-cv-template/zfgnyhdpmpqg
function generateClassicNUCV(data) {
    let html = '';
    const baseStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 12px;';
    const headerStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 20px; font-weight: bold;';
    const sectionStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 14px; font-weight: bold;';
    const subsectionStyle = 'font-family: Calibri, Arial, sans-serif; font-size: 13px; font-weight: bold;';
    
    // Header - Centered with "Curriculum Vitae"
    html += '<div class="text-center mb-6 print:mb-4 pb-4 print:pb-2" style="' + baseStyle + '">';
    html += `<h1 style="${headerStyle} margin-bottom: 4px;">${escapeHtml(data.name)}</h1>`;
    html += `<div style="${baseStyle} font-weight: bold; margin-bottom: 2px;">Curriculum Vitae</div>`;
    
    // Contact info
    const contactParts = [];
    if (data.location) contactParts.push(escapeHtml(data.location));
    if (data.email) contactParts.push(`<a href="mailto:${escapeHtml(data.email)}" style="color: inherit; text-decoration: none;">${escapeHtml(data.email)}</a>`);
    if (data.website) {
        const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
        contactParts.push(`<a href="${url}" style="color: inherit; text-decoration: none;">${escapeHtml(data.website)}</a>`);
    } else if (data.linkedin) {
        contactParts.push(`<a href="https://linkedin.com/in/${escapeHtml(data.linkedin)}" style="color: inherit; text-decoration: none;">${escapeHtml(data.linkedin)}</a>`);
    }
    
    if (contactParts.length > 0) {
        html += `<div style="${baseStyle} font-size: 11px;">${contactParts.join(' | ')}</div>`;
    }
    html += '</div>';
    
    // EDUCATION & EMPLOYMENT HISTORY (combined section)
    const hasEducation = data.education && data.education.length > 0;
    const hasExperience = data.experience && data.experience.length > 0;
    
    if (hasEducation || hasExperience) {
        html += `<div class="mb-6 print:mb-4 print:break-inside-avoid">`;
        html += `<h2 style="${sectionStyle} border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase;">EDUCATION & EMPLOYMENT HISTORY</h2>`;
        
        // Education entries
        if (hasEducation) {
            data.education.forEach(entry => {
                html += '<div class="mb-4 print:mb-3" style="margin-bottom: 16px;">';
                html += `<div style="${baseStyle} font-weight: bold; font-size: 14px;">${escapeHtml(entry.degree)}</div>`;
                
                // Year of completion
                if (entry.dateEnd) {
                    const year = entry.dateEnd.split('-')[0];
                    html += `<div style="${baseStyle}">Year of completion: ${year}</div>`;
                } else if (entry.dateStart) {
                    const year = entry.dateStart.split('-')[0];
                    html += `<div style="${baseStyle}">Year of completion: ${year}</div>`;
                }
                
                html += `<div style="${baseStyle}">${escapeHtml(entry.university)}</div>`;
                if (entry.city) {
                    html += `<div style="${baseStyle}">${escapeHtml(entry.city)}</div>`;
                }
                if (entry.thesis) {
                    html += `<div style="${baseStyle} margin-top: 4px;">${escapeHtml(entry.thesis)}</div>`;
                }
                html += '</div>';
            });
        }
        
        // Experience/Employment entries
        if (hasExperience) {
            data.experience.forEach(entry => {
                html += '<div class="mb-4 print:mb-3" style="margin-bottom: 16px;">';
                html += `<div style="${baseStyle} font-weight: bold; font-size: 14px;">${escapeHtml(entry.position)}</div>`;
                
                // Time Period
                const timePeriod = formatDateRange(entry.dateStart, entry.dateEnd);
                html += `<div style="${baseStyle}">Time Period: ${escapeHtml(timePeriod)}</div>`;
                
                html += `<div style="${baseStyle}">${escapeHtml(entry.company)}</div>`;
                if (entry.city) {
                    html += `<div style="${baseStyle}">${escapeHtml(entry.city)}</div>`;
                }
                if (entry.description) {
                    const items = entry.description.split('\n').filter(line => line.trim());
                    if (items.length > 0) {
                        html += '<div style="margin-top: 4px;">';
                        items.forEach(item => {
                            html += `<div style="${baseStyle}">${escapeHtml(item.trim())}</div>`;
                        });
                        html += '</div>';
                    }
                }
                html += '</div>';
            });
        }
        
        html += '</div>';
    }
    
    // PUBLICATIONS Section
    if (data.publications && data.publications.trim()) {
        html += `<div class="mb-6 print:mb-4 print:break-inside-avoid">`;
        html += `<h2 style="${sectionStyle} border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase;">PUBLICATIONS</h2>`;
        
        // For now, treat all publications as "Reviewed Articles" since we don't have categorization
        // In a full implementation, you'd want to parse and categorize publications
        html += `<div style="margin-left: 0;">`;
        html += `<h3 style="${subsectionStyle} margin-bottom: 8px; margin-top: 8px;">Reviewed Articles</h3>`;
        
        const publications = data.publications.split('\n').filter(line => line.trim());
        publications.forEach(pub => {
            html += `<div style="${baseStyle} margin-bottom: 4px;">${escapeHtml(pub.trim())}</div>`;
        });
        
        html += '</div></div>';
    }
    
    // SKILLS (if provided, as a simple list)
    if (data.skills && data.skills.trim()) {
        html += `<div class="mb-6 print:mb-4 print:break-inside-avoid">`;
        html += `<h2 style="${sectionStyle} border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase;">TECHNICAL SKILLS</h2>`;
        
        const skills = data.skills.split('\n').filter(line => line.trim());
        html += '<div style="margin-left: 0;">';
        skills.forEach(skill => {
            html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(skill.trim())}</div>`;
        });
        html += '</div></div>';
    }
    
    // LANGUAGES (if provided)
    if (data.languages && data.languages.length > 0) {
        html += `<div class="mb-6 print:mb-4 print:break-inside-avoid">`;
        html += `<h2 style="${sectionStyle} border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase;">LANGUAGES</h2>`;
        
        html += '<div style="margin-left: 0;">';
        data.languages.forEach(entry => {
            let langText = `<strong>${escapeHtml(entry.name)}</strong>`;
            if (entry.level) {
                langText += `: ${escapeHtml(entry.level)}`;
            }
            html += `<div style="${baseStyle} margin-bottom: 2px;">${langText}</div>`;
        });
        html += '</div></div>';
    }
    
    // PROJECTS (if provided, could be part of Creative Activity)
    if (data.projects && data.projects.length > 0) {
        html += `<div class="mb-6 print:mb-4 print:break-inside-avoid">`;
        html += `<h2 style="${sectionStyle} border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase;">PROJECTS</h2>`;
        
        data.projects.forEach(entry => {
            html += '<div class="mb-4 print:mb-3" style="margin-bottom: 12px;">';
            html += `<div style="${baseStyle} font-weight: bold; font-size: 14px;">${escapeHtml(entry.title)}</div>`;
            if (entry.tech) {
                html += `<div style="${baseStyle} font-size: 11px; color: #666;">${escapeHtml(entry.tech)}</div>`;
            }
            if (entry.description) {
                const items = entry.description.split('\n').filter(line => line.trim());
                items.forEach(item => {
                    html += `<div style="${baseStyle} margin-top: 2px;">${escapeHtml(item.trim())}</div>`;
                });
            }
            html += '</div>';
        });
        html += '</div>';
    }
    
    // AWARDS/SCHOLARSHIPS (if provided)
    if (data.awards && data.awards.trim()) {
        html += `<div class="mb-6 print:mb-4 print:break-inside-avoid">`;
        html += `<h2 style="${sectionStyle} border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase;">SCHOLARSHIPS AND AWARDS</h2>`;
        
        const awards = data.awards.split('\n').filter(line => line.trim());
        html += '<div style="margin-left: 0;">';
        awards.forEach(award => {
            // Handle the dots pattern for date separation
            const parts = award.trim().split(/\.\.\.\.\./);
            if (parts.length === 2) {
                html += `<div style="${baseStyle} margin-bottom: 2px; display: flex; justify-content: space-between;"><span>${escapeHtml(parts[0].trim())}</span><span>${escapeHtml(parts[1].trim())}</span></div>`;
            } else {
                html += `<div style="${baseStyle} margin-bottom: 2px;">${escapeHtml(award.trim())}</div>`;
            }
        });
        html += '</div></div>';
    }
    
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
                    <input type="month" class="edu-date-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">End Date (leave empty for "Present")</label>
                    <input type="month" class="edu-date-end flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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
                    <input type="month" class="exp-date-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-muted-foreground">End Date (leave empty for "Present")</label>
                    <input type="month" class="exp-date-end flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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
    if (data.title && document.getElementById('title')) document.getElementById('title').value = data.title;
    if (data.phone && document.getElementById('phone')) document.getElementById('phone').value = data.phone;
    if (data.birthdate && document.getElementById('birthdate')) document.getElementById('birthdate').value = data.birthdate;
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
        } else {
            addVolunteer();
        }
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
    } else {
        addProject();
    }
    
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
