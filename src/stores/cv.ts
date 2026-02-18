import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { CVData, EducationEntry, ExperienceEntry, VolunteerEntry, LanguageEntry, ProjectEntry } from '@/types/cv'

const STORAGE_KEY = 'cvData'

function defaultCVData(): CVData {
  return {
    template: 'minimal',
    name: '',
    photo: '',
    title: '',
    phone: '',
    birthdate: '',
    cityOfBirth: '',
    location: '',
    website: '',
    email: '',
    linkedin: '',
    github: '',
    dribbble: '',
    instagram: '',
    about: '',
    hobbies: '',
    education: [],
    experience: [],
    volunteer: [],
    publications: '',
    skills: '',
    languages: [],
    projects: [],
    awards: '',
  }
}

function loadFromStorage(): CVData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultCVData()
    const parsed = JSON.parse(raw) as Partial<CVData>
    return { ...defaultCVData(), ...parsed } as CVData
  } catch {
    return defaultCVData()
  }
}

export const useCVStore = defineStore('cv', () => {
  const data = ref<CVData>(loadFromStorage())

  watch(
    data,
    (v) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
      } catch {
        // ignore
      }
    },
    { deep: true }
  )

  function setPersonal(field: keyof CVData, value: string) {
    if (field in data.value) {
      (data.value as Record<string, unknown>)[field] = value
    }
  }

  function addEducation(entry?: Partial<EducationEntry>) {
    data.value.education.push({
      university: entry?.university ?? '',
      city: entry?.city ?? '',
      degree: entry?.degree ?? '',
      gpa: entry?.gpa ?? '',
      dateStart: entry?.dateStart ?? '',
      dateEnd: entry?.dateEnd ?? '',
      thesis: entry?.thesis ?? '',
    })
  }

  function removeEducation(index: number) {
    data.value.education.splice(index, 1)
  }

  function addExperience(entry?: Partial<ExperienceEntry>) {
    data.value.experience.push({
      company: entry?.company ?? '',
      city: entry?.city ?? '',
      position: entry?.position ?? '',
      dateStart: entry?.dateStart ?? '',
      dateEnd: entry?.dateEnd ?? '',
      description: entry?.description ?? '',
    })
  }

  function removeExperience(index: number) {
    data.value.experience.splice(index, 1)
  }

  function addVolunteer(entry?: Partial<VolunteerEntry>) {
    data.value.volunteer.push({
      organization: entry?.organization ?? '',
      position: entry?.position ?? '',
      dateStart: entry?.dateStart ?? '',
      dateEnd: entry?.dateEnd ?? '',
      description: entry?.description ?? '',
    })
  }

  function removeVolunteer(index: number) {
    data.value.volunteer.splice(index, 1)
  }

  function addLanguage(entry?: Partial<LanguageEntry>) {
    data.value.languages.push({
      name: entry?.name ?? '',
      level: entry?.level ?? '',
    })
  }

  function removeLanguage(index: number) {
    data.value.languages.splice(index, 1)
  }

  function addProject(entry?: Partial<ProjectEntry>) {
    data.value.projects.push({
      title: entry?.title ?? '',
      tech: entry?.tech ?? '',
      description: entry?.description ?? '',
    })
  }

  function removeProject(index: number) {
    data.value.projects.splice(index, 1)
  }

  function saveAndGoToPreview() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  function updatePageOptions(opts: {
    margin?: [number, number, number, number]
    paperSize?: string
    orientation?: string
  }) {
    if (opts.margin) data.value.margin = opts.margin
    if (opts.paperSize) data.value.paperSize = opts.paperSize
    if (opts.orientation) data.value.orientation = opts.orientation
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cv-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function loadFromJSON(obj: Partial<CVData>) {
    const merged = { ...defaultCVData(), ...obj } as CVData
    if (Array.isArray(merged.education)) data.value.education = merged.education
    if (Array.isArray(merged.experience)) data.value.experience = merged.experience
    if (Array.isArray(merged.volunteer)) data.value.volunteer = merged.volunteer
    if (Array.isArray(merged.languages)) data.value.languages = merged.languages
    if (Array.isArray(merged.projects)) data.value.projects = merged.projects
    data.value.template = merged.template ?? data.value.template
    data.value.name = merged.name ?? ''
    data.value.photo = merged.photo ?? ''
    data.value.title = merged.title ?? ''
    data.value.phone = merged.phone ?? ''
    data.value.birthdate = merged.birthdate ?? ''
    data.value.cityOfBirth = merged.cityOfBirth ?? ''
    data.value.location = merged.location ?? ''
    data.value.website = merged.website ?? ''
    data.value.email = merged.email ?? ''
    data.value.linkedin = merged.linkedin ?? ''
    data.value.github = merged.github ?? ''
    data.value.dribbble = merged.dribbble ?? ''
    data.value.instagram = merged.instagram ?? ''
    data.value.about = merged.about ?? ''
    data.value.hobbies = merged.hobbies ?? ''
    data.value.publications = merged.publications ?? ''
    data.value.skills = merged.skills ?? ''
    data.value.awards = merged.awards ?? ''
    if (merged.margin) data.value.margin = merged.margin
    if (merged.paperSize) data.value.paperSize = merged.paperSize
    if (merged.orientation) data.value.orientation = merged.orientation
  }

  return {
    data,
    setPersonal,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addVolunteer,
    removeVolunteer,
    addLanguage,
    removeLanguage,
    addProject,
    removeProject,
    saveAndGoToPreview,
    updatePageOptions,
    exportJSON,
    loadFromJSON,
  }
})
