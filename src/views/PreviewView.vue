<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCVStore } from '@/stores/cv'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Download, Sun, Moon } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const router = useRouter()
const store = useCVStore()
const containerRef = ref<HTMLElement | null>(null)
const isGeneratingPdf = ref(false)
const isDark = ref(false)
const isRendered = ref(false)

const data = computed(() => store.data)

const margin = computed({
  get: () => data.value.margin ?? [12, 5, 12, 5],
  set: (v: [number, number, number, number]) => store.updatePageOptions({ margin: v }),
})

const paperSize = computed({
  get: () => data.value.paperSize ?? 'letter',
  set: (v: string) => store.updatePageOptions({ paperSize: v }),
})

const orientation = computed({
  get: () => data.value.orientation ?? 'portrait',
  set: (v: string) => store.updatePageOptions({ orientation: v }),
})

const TEMPLATE_FONTS: Record<string, string> = {
  minimal: "'Montserrat', Arial, sans-serif",
  modern: "'Poppins', Arial, sans-serif",
  harvard: "Georgia, 'Times New Roman', serif",
  classic: "Georgia, 'Times New Roman', serif",
  luxsleek: "'Montserrat', Arial, sans-serif",
  nabhel: "'Poppins', Arial, sans-serif",
  yodi: "'Poppins', Arial, sans-serif",
}

const containerFont = computed(() => {
  const t = data.value.template ?? 'minimal'
  return TEMPLATE_FONTS[t] ?? "'Montserrat', Arial, sans-serif"
})

function renderCV() {
  if (!containerRef.value || typeof generateCVFromData !== 'function') return
  const d = data.value as unknown as Record<string, unknown>
  if (typeof prepareCVContainer === 'function') prepareCVContainer(d)
  containerRef.value.innerHTML = generateCVFromData(d)
  isRendered.value = true
}

function goBack() {
  router.push('/')
}

function applyPageSettings() {
  if (!containerRef.value || typeof prepareCVContainer !== 'function') return
  prepareCVContainer(data.value as unknown as Record<string, unknown>)
}

function clampMargin(val: number) {
  return Math.max(0, Math.min(20, Number.isFinite(val) ? val : 0))
}

function setMargin(index: 0 | 1 | 2 | 3, value: number) {
  const m = [...margin.value] as [number, number, number, number]
  m[index] = clampMargin(value)
  store.updatePageOptions({ margin: m })
  nextTick(applyPageSettings)
}

/** Temporary override so html2canvas sees hex instead of oklch (it doesn't support oklch). PDF will match preview. */
const PDF_OKLCH_OVERRIDE_ID = 'pdf-oklch-override'
const PDF_HEX_OVERRIDE = `
  html, html.dark, #cvContainer, #cvContainer * {
    --background: #ffffff !important;
    --foreground: #0a0a0a !important;
    --card: #ffffff !important;
    --card-foreground: #0a0a0a !important;
    --popover: #ffffff !important;
    --popover-foreground: #0a0a0a !important;
    --primary: #171717 !important;
    --primary-foreground: #fafafa !important;
    --secondary: #f5f5f5 !important;
    --secondary-foreground: #171717 !important;
    --muted: #f5f5f5 !important;
    --muted-foreground: #737373 !important;
    --accent: #f5f5f5 !important;
    --accent-foreground: #171717 !important;
    --destructive: #dc2626 !important;
    --destructive-foreground: #fafafa !important;
    --border: #e5e5e5 !important;
    --input: #e5e5e5 !important;
    --ring: #0a0a0a !important;
    --chart-1: #3b82f6 !important;
    --chart-2: #0d9488 !important;
    --chart-3: #1e3a5f !important;
    --chart-4: #eab308 !important;
    --chart-5: #ea580c !important;
    --sidebar: #fafafa !important;
    --sidebar-foreground: #0a0a0a !important;
    --sidebar-primary: #3b82f6 !important;
    --sidebar-primary-foreground: #fafafa !important;
    --sidebar-accent: #f5f5f5 !important;
    --sidebar-accent-foreground: #0a0a0a !important;
    --sidebar-border: #e5e5e5 !important;
    --sidebar-ring: #737373 !important;
  }
  #cvContainer { background: #ffffff !important; color: #0a0a0a !important; }
`

const PDF_SCALE = 2.5

async function downloadPDF() {
  const el = containerRef.value
  if (!el) return
  isGeneratingPdf.value = true
  const styleEl = document.createElement('style')
  styleEl.id = PDF_OKLCH_OVERRIDE_ID
  styleEl.textContent = PDF_HEX_OVERRIDE
  document.head.appendChild(styleEl)

  const savedMinHeight = el.style.minHeight
  const savedOverflow = el.style.overflow
  try {
    await nextTick()
    el.style.minHeight = `${el.scrollHeight}px`
    el.style.overflow = 'visible'
    await nextTick()

    const canvas = await html2canvas(el, {
      scale: PDF_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    el.style.minHeight = savedMinHeight
    el.style.overflow = savedOverflow

    const format = paperSize.value === 'a4' ? 'a4' : paperSize.value === 'legal' ? 'legal' : 'letter'
    const orient = orientation.value === 'landscape' ? ('l' as const) : ('p' as const)
    const pdf = new jsPDF({ orientation: orient, unit: 'mm', format })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const m = margin.value
    const [top, right, bottom, left] = [m[0], m[1], m[2], m[3]]
    const contentW = pageW - left - right
    const contentH = pageH - top - bottom

    const cw = canvas.width
    const ch = canvas.height
    const pageHeightPx = Math.round(cw * (contentH / contentW))
    let y = 0
    let pageIndex = 0
    while (y < ch) {
      if (pageIndex > 0) pdf.addPage()
      const sliceH = Math.min(pageHeightPx, ch - y)
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = cw
      pageCanvas.height = sliceH
      const ctx = pageCanvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, cw, sliceH)
      ctx.drawImage(canvas, 0, y, cw, sliceH, 0, 0, cw, sliceH)
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.98)
      const sliceContentH = (sliceH / pageHeightPx) * contentH
      pdf.addImage(imgData, 'JPEG', left, top, contentW, sliceContentH)
      y += pageHeightPx
      pageIndex++
    }

    const name = (data.value.name || 'cv').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    pdf.save(`${name}_cv.pdf`)
  } catch (e) {
    console.error(e)
    el.style.minHeight = savedMinHeight
    el.style.overflow = savedOverflow
    alert('Error generating PDF. Please try again.')
  } finally {
    styleEl.remove()
    isGeneratingPdf.value = false
  }
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

onMounted(() => {
  initTheme()
  renderCV()
})

watch(
  () => data.value.template,
  () => renderCV()
)
watch(
  () => [data.value.paperSize, data.value.orientation, data.value.margin],
  () => nextTick(applyPageSettings),
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 print:bg-white">
    <div class="max-w-4xl mx-auto bg-card rounded-lg shadow-sm print:max-w-none print:shadow-none print:rounded-none">
      <!-- Page options (fixed right) -->
      <div
        class="fixed top-1/2 right-4 -translate-y-1/2 z-50 bg-background/95 backdrop-blur border border-border rounded-lg shadow-lg p-4 print:hidden"
      >
        <div class="text-xs font-semibold text-muted-foreground mb-3">Page Options</div>
        <div class="space-y-3">
          <div class="grid gap-2">
            <Label class="text-xs">Paper</Label>
            <select
              :value="paperSize"
              class="w-full h-9 rounded-md border border-input bg-background px-2 py-1 text-sm"
              @change="paperSize = ($event.target as HTMLSelectElement).value"
            >
              <option value="letter">Letter</option>
              <option value="a4">A4</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          <div class="grid gap-2">
            <Label class="text-xs">Orientation</Label>
            <select
              :value="orientation"
              class="w-full h-9 rounded-md border border-input bg-background px-2 py-1 text-sm"
              @change="orientation = ($event.target as HTMLSelectElement).value"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <Label class="text-xs">Top (mm)</Label>
              <Input
                type="number"
                min="0"
                max="20"
                :value="margin[0]"
                class="h-9 text-sm text-center"
                @input="setMargin(0, +(($event.target as HTMLInputElement).value) || 0)"
              />
            </div>
            <div>
              <Label class="text-xs">Bottom</Label>
              <Input
                type="number"
                min="0"
                max="20"
                :value="margin[2]"
                class="h-9 text-sm text-center"
                @input="setMargin(2, +(($event.target as HTMLInputElement).value) || 0)"
              />
            </div>
            <div>
              <Label class="text-xs">Right</Label>
              <Input
                type="number"
                min="0"
                max="20"
                :value="margin[1]"
                class="h-9 text-sm text-center"
                @input="setMargin(1, +(($event.target as HTMLInputElement).value) || 0)"
              />
            </div>
            <div>
              <Label class="text-xs">Left</Label>
              <Input
                type="number"
                min="0"
                max="20"
                :value="margin[3]"
                class="h-9 text-sm text-center"
                @input="setMargin(3, +(($event.target as HTMLInputElement).value) || 0)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Header -->
      <header
        class="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur print:hidden"
      >
        <div class="p-4 md:p-6">
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h1 class="text-xl md:text-2xl font-bold tracking-tight">Your CV Preview</h1>
            <div class="flex gap-2">
              <Button :disabled="isGeneratingPdf" @click="downloadPDF">
                <Download class="h-4 w-4 mr-2" />
                {{ isGeneratingPdf ? 'Generating…' : 'Download PDF' }}
              </Button>
              <Button variant="secondary" @click="goBack">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
              <Button variant="secondary" size="icon" aria-label="Toggle theme" @click="toggleTheme">
                <Sun v-if="isDark" class="h-5 w-5" />
                <Moon v-else class="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <!-- CV container: must have id cvContainer for script.js prepareCVContainer. No Vue children inside so innerHTML replacement doesn't break vnodes. -->
      <div class="flex justify-center items-start px-4 py-6 print:p-0 print:m-0">
        <div v-if="!isRendered" class="text-center py-8 text-muted-foreground w-full">
          Loading CV…
        </div>
        <div
          v-show="isRendered"
          id="cvContainer"
          ref="containerRef"
          class="cv-preview bg-card text-foreground rounded-lg shadow-lg p-6 md:p-8 print:shadow-none print:rounded-none print:p-6 print:m-0 print:bg-white print:mx-auto mx-auto"
          :style="{ fontFamily: containerFont }"
          style="padding: 24px;"
        />
      </div>
    </div>
  </div>
</template>
