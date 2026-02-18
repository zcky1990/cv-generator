export interface EducationEntry {
  university: string
  city: string
  degree: string
  gpa: string
  dateStart: string
  dateEnd: string
  date?: string
  thesis: string
}

export interface ExperienceEntry {
  company: string
  city: string
  position: string
  dateStart: string
  dateEnd: string
  date?: string
  description: string
}

export interface VolunteerEntry {
  organization: string
  position: string
  dateStart: string
  dateEnd: string
  date?: string
  description: string
}

export interface LanguageEntry {
  name: string
  level: string
}

export interface ProjectEntry {
  title: string
  tech: string
  description: string
}

export type TemplateId = 'minimal' | 'modern' | 'nabhel' | 'yodi' | 'harvard'

export interface CVData {
  template: TemplateId
  name: string
  photo: string
  title: string
  phone: string
  birthdate: string
  cityOfBirth: string
  location: string
  website: string
  email: string
  linkedin: string
  github: string
  dribbble: string
  instagram: string
  about: string
  hobbies: string
  education: EducationEntry[]
  experience: ExperienceEntry[]
  volunteer: VolunteerEntry[]
  publications: string
  skills: string
  languages: LanguageEntry[]
  projects: ProjectEntry[]
  awards: string
  margin?: [number, number, number, number]
  paperSize?: string
  orientation?: string
}

export const TEMPLATES: { id: TemplateId; label: string; description: string }[] = [
  { id: 'minimal', label: 'Minimal', description: 'Clean two-column minimalist design - Simple and elegant' },
  { id: 'modern', label: 'Modern', description: 'Single column clean layout - Based on Figma design' },
  { id: 'nabhel', label: 'Nabhel', description: 'Two-column layout with sidebar - Perfect for UX/UI designers' },
  { id: 'yodi', label: 'Yodi', description: 'Professional UX/UI designer template - Clean and modern' },
  { id: 'harvard', label: 'Harvard', description: 'Academic resume template - Times New Roman, professional format' },
]
