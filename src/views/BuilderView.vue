<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCVStore } from '@/stores/cv'
import { TEMPLATES } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, computed } from 'vue'
import {
  Sun,
  Moon,
  FileJson,
  LayoutTemplate,
  User,
  GraduationCap,
  Briefcase,
  Heart,
  FileText,
  Wrench,
  Languages,
  FolderGit2,
  Award,
  Download,
  Upload,
  ChevronRight,
} from 'lucide-vue-next'

const router = useRouter()
const store = useCVStore()
const data = computed(() => store.data)

const jsonInput = ref<HTMLInputElement | null>(null)
const isDark = ref(false)

const categories = [
  { id: 'section-templates', title: 'Template', description: 'Choose a CV template style', icon: LayoutTemplate },
  { id: 'section-personal', title: 'Personal Info', description: 'Contact details and photo', icon: User },
  { id: 'section-education', title: 'Education', description: 'Academic background', icon: GraduationCap },
  { id: 'section-experience', title: 'Experience', description: 'Work history', icon: Briefcase },
  { id: 'section-volunteer', title: 'Volunteer', description: 'Volunteer work', icon: Heart },
  { id: 'section-publications', title: 'Publications', description: 'Papers and publications', icon: FileText },
  { id: 'section-skills', title: 'Skills', description: 'Skills and technologies', icon: Wrench },
  { id: 'section-languages', title: 'Languages', description: 'Language proficiency', icon: Languages },
  { id: 'section-projects', title: 'Projects', description: 'Portfolio projects', icon: FolderGit2 },
  { id: 'section-awards', title: 'Awards', description: 'Scholarships and awards', icon: Award },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } catch {
    //
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
}

function loadJsonClick() {
  jsonInput.value?.click()
}

function onJsonFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const obj = JSON.parse(ev.target?.result as string)
      store.loadFromJSON(obj)
    } catch (err) {
      alert('Error loading JSON: ' + (err instanceof Error ? err.message : String(err)))
    }
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

function onPhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('image/')) {
    if (file) alert('Please select an image file')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('Image size should be less than 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    const result = ev.target?.result as string
    if (result) store.setPersonal('photo', result)
  }
  reader.readAsDataURL(file)
}

function removePhoto() {
  store.setPersonal('photo', '')
}

function submit() {
  if (!data.value.name?.trim() || !data.value.email?.trim()) {
    alert('Please fill in required fields (Name and Email).')
    return
  }
  store.saveAndGoToPreview()
  router.push('/preview')
}

initTheme()
</script>

<template>
  <div class="min-h-screen print:bg-white">
    <!-- Sticky header (Help 1 style) -->
    <!-- <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h1 class="text-xl font-bold tracking-tight">CV Builder</h1>
          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" :aria-label="isDark ? 'Light mode' : 'Dark mode'" @click="toggleTheme">
              <Sun v-if="isDark" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header> -->

    <main class="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <!-- Hero -->
      <section class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">Create Your Professional CV</h2>
        <p class="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
          Fill in your details by section, then generate and download your CV preview.
        </p>
      </section>

      <!-- Category grid (Help 1 – CV sections) -->
      <section class="mb-12">
        <h3 class="text-lg font-semibold mb-4">CV Sections</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="flex items-start gap-4 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            @click="scrollToSection(cat.id)"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <component :is="cat.icon" class="h-5 w-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium">{{ cat.title }}</p>
              <p class="text-sm text-muted-foreground">{{ cat.description }}</p>
            </div>
            <ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </section>

      <!-- Quick actions (Help 1 – popular topics style) -->
      <section class="mb-12">
        <h3 class="text-lg font-semibold mb-4">Quick actions</h3>
        <div class="grid gap-4 sm:grid-cols-3">
          <Button class="h-auto flex-col gap-2 py-4" @click="submit">
            <Download class="h-5 w-5" />
            <span>Generate CV Preview</span>
          </Button>
          <Button variant="secondary" class="h-auto flex-col gap-2 py-4" @click="store.exportJSON">
            <FileJson class="h-5 w-5" />
            <span>Save as JSON</span>
          </Button>
          <Button variant="outline" class="h-auto flex-col gap-2 py-4" @click="loadJsonClick">
            <Upload class="h-5 w-5" />
            <span>Load from JSON</span>
          </Button>
        </div>
        <input ref="jsonInput" type="file" accept=".json" class="hidden" @change="onJsonFile">
      </section>

      <!-- Form sections (with IDs for scroll) -->
      <form class="space-y-8" @submit.prevent="submit">
        <!-- Template Selection -->
        <Card id="section-templates">
          <CardHeader>
            <CardTitle>Select Template</CardTitle>
            <CardDescription>Choose a template style for your CV preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label
                v-for="t in TEMPLATES"
                :key="t.id"
                class="cursor-pointer"
              >
                <input
                  v-model="data.template"
                  type="radio"
                  :value="t.id"
                  class="sr-only peer"
                >
                <div
                  class="rounded-lg border-2 border-border bg-card p-4 transition-all hover:border-ring hover:shadow-md peer-checked:border-ring peer-checked:ring-2 peer-checked:ring-ring peer-checked:ring-offset-2 peer-checked:bg-accent/50"
                >
                  <div class="font-semibold mb-1">{{ t.label }}</div>
                  <div class="text-sm text-muted-foreground">{{ t.description }}</div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <!-- Personal Information -->
        <Card id="section-personal">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Enter your contact details</CardDescription>
          </CardHeader>
          <CardContent class="grid gap-4">
            <div class="space-y-2">
              <Label for="name">Full Name <span class="text-destructive">*</span></Label>
              <Input id="name" v-model="data.name" required placeholder="John Doe" />
            </div>
            <div class="space-y-2">
              <Label for="photo">Profile Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                @change="onPhotoChange"
              />
              <div v-if="data.photo" class="mt-2 flex items-center gap-4">
                <img :src="data.photo" alt="Preview" class="w-24 h-24 object-cover rounded-full border-2 border-border">
                <Button type="button" variant="destructive" size="sm" @click="removePhoto">
                  Remove photo
                </Button>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="title">Job Title / Position</Label>
              <Input id="title" v-model="data.title" placeholder="Frontend Developer" />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="phone">Phone</Label>
                <Input id="phone" v-model="data.phone" type="tel" placeholder="+1 234 567 8900" />
              </div>
              <div class="space-y-2">
                <Label for="birthdate">Date of Birth</Label>
                <Input id="birthdate" v-model="data.birthdate" type="date" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="cityOfBirth">City of Birth</Label>
              <Input id="cityOfBirth" v-model="data.cityOfBirth" placeholder="Surakarta" />
            </div>
            <div class="space-y-2">
              <Label for="location">Location / Address</Label>
              <Input id="location" v-model="data.location" placeholder="City, Country" />
            </div>
            <div class="space-y-2">
              <Label for="website">Website</Label>
              <Input id="website" v-model="data.website" type="url" placeholder="https://example.com" />
            </div>
            <div class="space-y-2">
              <Label for="email">Email <span class="text-destructive">*</span></Label>
              <Input id="email" v-model="data.email" type="email" required placeholder="john@example.com" />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="linkedin">LinkedIn</Label>
                <Input id="linkedin" v-model="data.linkedin" placeholder="john-doe" />
              </div>
              <div class="space-y-2">
                <Label for="github">GitHub</Label>
                <Input id="github" v-model="data.github" placeholder="github.com/johndoe" />
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="dribbble">Dribbble</Label>
                <Input id="dribbble" v-model="data.dribbble" placeholder="dribbble.com/johndoe" />
              </div>
              <div class="space-y-2">
                <Label for="instagram">Instagram</Label>
                <Input id="instagram" v-model="data.instagram" placeholder="instagram.com/johndoe" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="about">About / Bio</Label>
              <Textarea id="about" v-model="data.about" rows="4" placeholder="Brief description about yourself..." />
            </div>
            <div class="space-y-2">
              <Label for="hobbies">Hobbies &amp; Interests (one per line)</Label>
              <Textarea id="hobbies" v-model="data.hobbies" rows="3" placeholder="Reading&#10;Movies&#10;Travel" />
            </div>
          </CardContent>
        </Card>

        <!-- Education -->
        <Card id="section-education">
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Add your educational background</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(edu, idx) in data.education"
              :key="idx"
              class="rounded-lg border border-border bg-muted/50 p-4 space-y-4"
            >
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label>University <span class="text-destructive">*</span></Label>
                  <Input v-model="edu.university" placeholder="University Name" required />
                </div>
                <div class="space-y-2">
                  <Label>City, Country</Label>
                  <Input v-model="edu.city" placeholder="Jakarta, Indonesia" />
                </div>
              </div>
              <div class="space-y-2">
                <Label>Degree / Program <span class="text-destructive">*</span></Label>
                <Input v-model="edu.degree" placeholder="Ph.D. in Area Name" required />
              </div>
              <div class="space-y-2">
                <Label>GPA (optional)</Label>
                <Input v-model="edu.gpa" placeholder="3.50 / 4.00" />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label>Start Date</Label>
                  <Input v-model="edu.dateStart" type="date" />
                </div>
                <div class="space-y-2">
                  <Label>End Date (empty = Present)</Label>
                  <Input v-model="edu.dateEnd" type="date" />
                </div>
              </div>
              <div class="space-y-2">
                <Label>Thesis (optional)</Label>
                <Input v-model="edu.thesis" placeholder="Title of thesis" />
              </div>
              <Button type="button" variant="destructive" size="sm" @click="store.removeEducation(idx)">
                Remove
              </Button>
            </div>
            <Button type="button" @click="store.addEducation()">
              + Add Education
            </Button>
          </CardContent>
        </Card>

        <!-- Experience -->
        <Card id="section-experience">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
            <CardDescription>Add your work experience</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(exp, idx) in data.experience"
              :key="idx"
              class="rounded-lg border border-border bg-muted/50 p-4 space-y-4"
            >
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label>Company <span class="text-destructive">*</span></Label>
                  <Input v-model="exp.company" placeholder="Company Name" required />
                </div>
                <div class="space-y-2">
                  <Label>City, Country</Label>
                  <Input v-model="exp.city" placeholder="Jakarta, Indonesia" />
                </div>
              </div>
              <div class="space-y-2">
                <Label>Position <span class="text-destructive">*</span></Label>
                <Input v-model="exp.position" placeholder="Position title" required />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label>Start Date</Label>
                  <Input v-model="exp.dateStart" type="date" />
                </div>
                <div class="space-y-2">
                  <Label>End Date (empty = Present)</Label>
                  <Input v-model="exp.dateEnd" type="date" />
                </div>
              </div>
              <div class="space-y-2">
                <Label>Description (one per line) <span class="text-destructive">*</span></Label>
                <Textarea v-model="exp.description" rows="3" placeholder="Key responsibility&#10;Another point" required />
              </div>
              <Button type="button" variant="destructive" size="sm" @click="store.removeExperience(idx)">
                Remove
              </Button>
            </div>
            <Button type="button" @click="store.addExperience()">
              + Add Experience
            </Button>
          </CardContent>
        </Card>

        <!-- Volunteer -->
        <Card id="section-volunteer">
          <CardHeader>
            <CardTitle>Volunteer Experience</CardTitle>
            <CardDescription>Add volunteer work and community involvement</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(vol, idx) in data.volunteer"
              :key="idx"
              class="rounded-lg border border-border bg-muted/50 p-4 space-y-4"
            >
              <div class="space-y-2">
                <Label>Organization <span class="text-destructive">*</span></Label>
                <Input v-model="vol.organization" placeholder="Organization Name" required />
              </div>
              <div class="space-y-2">
                <Label>Position <span class="text-destructive">*</span></Label>
                <Input v-model="vol.position" placeholder="Volunteer Role" required />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label>Start Date</Label>
                  <Input v-model="vol.dateStart" type="date" />
                </div>
                <div class="space-y-2">
                  <Label>End Date</Label>
                  <Input v-model="vol.dateEnd" type="date" />
                </div>
              </div>
              <div class="space-y-2">
                <Label>Description</Label>
                <Textarea v-model="vol.description" rows="2" />
              </div>
              <Button type="button" variant="destructive" size="sm" @click="store.removeVolunteer(idx)">
                Remove
              </Button>
            </div>
            <Button type="button" @click="store.addVolunteer()">
              + Add Volunteer Experience
            </Button>
          </CardContent>
        </Card>

        <!-- Publications -->
        <Card id="section-publications">
          <CardHeader>
            <CardTitle>Publications</CardTitle>
            <CardDescription>List your publications (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              v-model="data.publications"
              rows="5"
              placeholder='[1] Author, "Title", in Conference, Date, pp. pages.'
              class="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <!-- Skills -->
        <Card id="section-skills">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Skills and technologies (one per line: Group: list)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              v-model="data.skills"
              rows="4"
              placeholder="Programming: Python, JavaScript&#10;Frameworks: React, Vue"
              class="min-h-[96px]"
            />
          </CardContent>
        </Card>

        <!-- Languages -->
        <Card id="section-languages">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Languages you speak</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(lang, idx) in data.languages"
              :key="idx"
              class="rounded-lg border border-border bg-muted/50 p-4 flex flex-wrap gap-4 items-end"
            >
              <div class="flex-1 min-w-[120px] space-y-2">
                <Label>Language <span class="text-destructive">*</span></Label>
                <Input v-model="lang.name" placeholder="English" required />
              </div>
              <div class="flex-1 min-w-[120px] space-y-2">
                <Label>Proficiency</Label>
                <Input v-model="lang.level" placeholder="Native / TOEFL: 120" />
              </div>
              <Button type="button" variant="destructive" size="sm" @click="store.removeLanguage(idx)">
                Remove
              </Button>
            </div>
            <Button type="button" @click="store.addLanguage()">
              + Add Language
            </Button>
          </CardContent>
        </Card>

        <!-- Projects -->
        <Card id="section-projects">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Add your projects</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(proj, idx) in data.projects"
              :key="idx"
              class="rounded-lg border border-border bg-muted/50 p-4 space-y-4"
            >
              <div class="space-y-2">
                <Label>Project Title <span class="text-destructive">*</span></Label>
                <Input v-model="proj.title" placeholder="Project Title" required />
              </div>
              <div class="space-y-2">
                <Label>Technology / Year</Label>
                <Input v-model="proj.tech" placeholder="Vue, TypeScript, 2024" />
              </div>
              <div class="space-y-2">
                <Label>Description <span class="text-destructive">*</span></Label>
                <Textarea v-model="proj.description" rows="2" required placeholder="Short description" />
              </div>
              <Button type="button" variant="destructive" size="sm" @click="store.removeProject(idx)">
                Remove
              </Button>
            </div>
            <Button type="button" @click="store.addProject()">
              + Add Project
            </Button>
          </CardContent>
        </Card>

        <!-- Awards -->
        <Card id="section-awards">
          <CardHeader>
            <CardTitle>Scholarships and Awards</CardTitle>
            <CardDescription>One per line: Award Name ..... Year</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              v-model="data.awards"
              rows="5"
              placeholder="Some Scholarship ..... 2018-2020"
              class="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <!-- Bottom CTA (Help 1 – Contact Support style) -->
        <Card class="border-primary/20 bg-primary/5">
          <CardContent class="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
            <div>
              <h3 class="text-lg font-semibold mb-1">Ready to preview?</h3>
              <p class="text-sm text-muted-foreground">
                Generate your CV with the selected template and download as PDF.
              </p>
            </div>
            <Button type="submit" size="lg" class="shrink-0">
              Generate CV Preview
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  </div>
</template>
