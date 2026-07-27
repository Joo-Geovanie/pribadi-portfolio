<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { definePageMeta, useSupabaseClient } from '#imports'

definePageMeta({
  middleware: 'admin'
})

const supabase = useSupabaseClient()
const router = useRouter()

// UI Tab State
const activeTab = ref('projects') // profile | projects | messages

// Form and Data States
const profileId = ref('')
const profileName = ref('')
const heroTitle = ref('')
const heroSubtitle = ref('')
const aboutText = ref('')
const profileStatus = ref('')

const services = ref<any[]>([])

const projects = ref<any[]>([])
const newProjectTitle = ref('')
const newProjectDesc = ref('')
const newProjectCategory = ref('')
const newProjectLocation = ref('')
const newProjectYear = ref('')
const newProjectLink = ref('')
const newProjectSort = ref(0)
const projectFile = ref<File | null>(null)
const projectStatus = ref('')

// Edit Project Modal States
const isEditing = ref(false)
const editId = ref('')
const editTitle = ref('')
const editDesc = ref('')
const editCategory = ref('')
const editLocation = ref('')
const editYear = ref('')
const editLink = ref('')
const editSort = ref(0)
const editImageUrl = ref('')
const editFile = ref<File | null>(null)
const editStatus = ref('')

const messages = ref<any[]>([])

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

// Fetch content
const fetchData = async () => {
  // Fetch company profile
  const { data: profile } = await supabase.from('company_profile').select('*').limit(1).maybeSingle()
  if (profile) {
    profileId.value = profile.id
    profileName.value = profile.name
    heroTitle.value = profile.hero_title
    heroSubtitle.value = profile.hero_subtitle
    aboutText.value = profile.about_text
  }

  // Fetch projects
  const { data: projs } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
  if (projs) projects.value = projs

  // Fetch messages
  const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  if (msgs) messages.value = msgs
}

// Update profile text
const updateProfile = async () => {
  profileStatus.value = 'SAVING CONFIG...'
  try {
    let error
    if (profileId.value) {
      const { error: err } = await supabase.from('company_profile').update({
        name: profileName.value,
        hero_title: heroTitle.value,
        hero_subtitle: heroSubtitle.value,
        about_text: aboutText.value,
        updated_at: new Date().toISOString()
      }).eq('id', profileId.value)
      error = err
    } else {
      const { data, error: err } = await supabase.from('company_profile').insert([
        {
          name: profileName.value,
          hero_title: heroTitle.value,
          hero_subtitle: heroSubtitle.value,
          about_text: aboutText.value
        }
      ]).select().single()
      error = err
      if (data) profileId.value = data.id
    }

    if (error) throw error
    profileStatus.value = 'CONFIG UPDATED // SUCCESS'
    setTimeout(() => { profileStatus.value = '' }, 3000)
  } catch (err: any) {
    profileStatus.value = `ERR // ${err.message || 'SAVE FAILED'}`
  }
}

// File picker handlers
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    projectFile.value = target.files[0]
  }
}

const handleEditFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    editFile.value = target.files[0]
  }
}

// Create new project with optional image upload
const addProject = async () => {
  if (!newProjectTitle.value || !newProjectDesc.value || !newProjectCategory.value || !newProjectYear.value) {
    projectStatus.value = 'ERR // INCOMPLETE PROJECT FORM'
    return
  }

  projectStatus.value = 'UPLOADING MISSION...'
  try {
    let imageUrl = ''

    // Handle Supabase Storage upload
    if (projectFile.value) {
      const file = projectFile.value
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ocean-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('ocean-assets')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    const projectPayload: any = {
      title: newProjectTitle.value,
      description: newProjectDesc.value,
      category: newProjectCategory.value,
      location: newProjectLocation.value || null,
      year: newProjectYear.value,
      image_url: imageUrl || null,
      link: newProjectLink.value || null,
      sort_order: newProjectSort.value
    }

    let { error: dbError } = await supabase.from('projects').insert([projectPayload])

    if (dbError && dbError.message?.includes('location')) {
      delete projectPayload.location
      const { error: fallbackError } = await supabase.from('projects').insert([projectPayload])
      dbError = fallbackError
    }

    if (dbError) throw dbError

    projectStatus.value = 'MISSION LOGGED // SUCCESS'
    
    // Reset forms
    newProjectTitle.value = ''
    newProjectDesc.value = ''
    newProjectCategory.value = ''
    newProjectLocation.value = ''
    newProjectYear.value = ''
    newProjectLink.value = ''
    newProjectSort.value = 0
    projectFile.value = null
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    await fetchData()
    setTimeout(() => { projectStatus.value = '' }, 3000)
  } catch (err: any) {
    projectStatus.value = `ERR // ${err.message || 'ADD FAILED'}`
  }
}

// Open Edit Modal
const openEditModal = (project: any) => {
  editId.value = project.id
  editTitle.value = project.title
  editDesc.value = project.description
  editCategory.value = project.category || ''
  editLocation.value = project.location || ''
  editYear.value = project.year || ''
  editLink.value = project.link || ''
  editSort.value = project.sort_order || 0
  editImageUrl.value = project.image_url || ''
  editFile.value = null
  editStatus.value = ''
  isEditing.value = true
}

// Save Project Edit
const updateProject = async () => {
  if (!editTitle.value || !editDesc.value) {
    editStatus.value = 'ERR // TITLE AND DESCRIPTION REQUIRED'
    return
  }

  editStatus.value = 'SAVING UPDATES...'
  try {
    let imageUrl = editImageUrl.value

    if (editFile.value) {
      const file = editFile.value
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ocean-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('ocean-assets')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    const updatePayload: any = {
      title: editTitle.value,
      description: editDesc.value,
      category: editCategory.value,
      location: editLocation.value || null,
      year: editYear.value,
      image_url: imageUrl || null,
      link: editLink.value || null,
      sort_order: editSort.value
    }

    let { error: dbError } = await supabase.from('projects').update(updatePayload).eq('id', editId.value)

    if (dbError && dbError.message?.includes('location')) {
      delete updatePayload.location
      const { error: fallbackError } = await supabase.from('projects').update(updatePayload).eq('id', editId.value)
      dbError = fallbackError
    }

    if (dbError) throw dbError

    editStatus.value = 'LOG UPDATED // SUCCESS'
    await fetchData()
    setTimeout(() => {
      isEditing.value = false
      editStatus.value = ''
    }, 1200)
  } catch (err: any) {
    editStatus.value = `ERR // ${err.message || 'UPDATE FAILED'}`
  }
}

// Delete project
const deleteProject = async (id: string) => {
  if (!confirm('DELETE THIS RECORD?')) return
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    await fetchData()
  } catch (err: any) {
    alert(`FAILED TO DELETE: ${err.message}`)
  }
}

// Delete message
const deleteMessage = async (id: string) => {
  if (!confirm('DELETE MESSAGE PACKET?')) return
  try {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) throw error
    await fetchData()
  } catch (err: any) {
    alert(`FAILED TO CLEAR MESSAGE: ${err.message}`)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-[#020514] font-mono text-white p-6 relative">
    <div class="max-w-5xl mx-auto flex flex-col gap-8">
      
      <!-- Top CMS Navigation bar -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sonar-blue/30 pb-6">
        <div>
          <div class="text-[10px] text-sonar-blue tracking-widest">// COMMAND DECK CMS</div>
          <h1 class="text-2xl font-bold tracking-tight">DSV MISSION CONSOLE</h1>
        </div>
        <div class="flex gap-4">
          <NuxtLink to="/" class="border border-sonar-blue/40 text-sonar-blue hover:bg-sonar-blue/10 px-4 py-2 text-xs rounded transition uppercase">
            View Live Site
          </NuxtLink>
          <button @click="logout" class="bg-red-950 border border-red-500/30 text-red-400 hover:bg-red-900/40 px-4 py-2 text-xs rounded transition uppercase">
            Disconnect Terminal
          </button>
        </div>
      </div>

      <!-- Tab selectors -->
      <div class="flex border-b border-sonar-blue/10">
        <button 
          @click="activeTab = 'profile'"
          :class="activeTab === 'profile' ? 'border-b-2 border-sonar-blue text-sonar-blue font-bold' : 'text-gray-400'"
          class="px-6 py-3 text-xs tracking-wider uppercase transition focus:outline-none"
        >
          01 // BRIDGE CONFIG
        </button>
        <button 
          @click="activeTab = 'projects'"
          :class="activeTab === 'projects' ? 'border-b-2 border-sonar-blue text-sonar-blue font-bold' : 'text-gray-400'"
          class="px-6 py-3 text-xs tracking-wider uppercase transition focus:outline-none"
        >
          02 // MISSION LOGS
        </button>
        <button 
          @click="activeTab = 'messages'"
          :class="activeTab === 'messages' ? 'border-b-2 border-sonar-blue text-sonar-blue font-bold' : 'text-gray-400'"
          class="px-6 py-3 text-xs tracking-wider uppercase transition focus:outline-none"
        >
          03 // COMMS INBOX ({{ messages.length }})
        </button>
      </div>

      <!-- Tab 1: Profile Config -->
      <div v-if="activeTab === 'profile'" class="bg-black/40 border border-sonar-blue/20 p-6 rounded-md flex flex-col gap-6">
        <div>
          <h2 class="text-lg font-bold text-sonar-blue">Bridge Parameters Configuration</h2>
          <p class="text-[10px] text-gray-400">Configure global metadata displaying in your home section.</p>
        </div>

        <form @submit.prevent="updateProfile" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400">COMPANY NAME</label>
            <input v-model="profileName" type="text" required class="bg-black/55 border border-sonar-blue/20 p-3 text-sm focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400">HERO HEADLINE TITLE</label>
            <input v-model="heroTitle" type="text" required class="bg-black/55 border border-sonar-blue/20 p-3 text-sm focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400">HERO DESCRIPTION</label>
            <input v-model="heroSubtitle" type="text" required class="bg-black/55 border border-sonar-blue/20 p-3 text-sm focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400">DETAILED ABOUT BIOGRAPHY</label>
            <textarea v-model="aboutText" required class="bg-black/55 border border-sonar-blue/20 p-3 text-sm focus:border-sonar-blue focus:outline-none rounded text-white font-mono h-32"></textarea>
          </div>

          <div class="flex items-center justify-between mt-2">
            <div v-if="profileStatus" class="text-xs font-bold" :class="profileStatus.includes('ERR') ? 'text-red-500' : 'text-sonar-green'">
              {{ profileStatus }}
            </div>
            <div v-else></div>
            <button type="submit" class="bg-sonar-blue text-black font-bold px-6 py-3 text-xs uppercase tracking-wider rounded font-mono hover:bg-sonar-blue/80 transition">
              Apply System Configurations
            </button>
          </div>
        </form>
      </div>

      <!-- Tab 2: Mission Logs (Projects) -->
      <div v-if="activeTab === 'projects'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Add Project Form (Left-side) -->
        <div class="lg:col-span-1 bg-black/40 border border-sonar-blue/20 p-6 rounded-md flex flex-col gap-4 h-fit">
          <div>
            <h2 class="text-sm font-bold text-sonar-blue">Log New Mission</h2>
            <p class="text-[9px] text-gray-500">Insert custom cards into scrollable expeditions.</p>
          </div>

          <form @submit.prevent="addProject" class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">MISSION NAME (TITLE)</label>
              <input v-model="newProjectTitle" type="text" required class="bg-black/55 border border-sonar-blue/20 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" placeholder="Web E-Commerce / App..." />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">CATEGORY (E.G. WEB, MOBILE, SYSTEM)</label>
              <input v-model="newProjectCategory" type="text" required class="bg-black/55 border border-sonar-blue/20 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" placeholder="Web" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-sonar-blue font-bold">LOCATION / CONTEXT (OPTIONAL)</label>
              <input v-model="newProjectLocation" type="text" class="bg-black/55 border border-sonar-blue/40 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" placeholder="e.g. Intern at PT Telkom / Lomba HackFest / Freelance" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">YEAR (E.G. 2026)</label>
              <input v-model="newProjectYear" type="text" required class="bg-black/55 border border-sonar-blue/20 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" placeholder="2026" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">UPLINK ADDRESS (URL LINK)</label>
              <input v-model="newProjectLink" type="url" class="bg-black/55 border border-sonar-blue/20 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" placeholder="https://..." />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">SORT PRIORITY ORDER</label>
              <input v-model="newProjectSort" type="number" required class="bg-black/55 border border-sonar-blue/20 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">IMAGE PACKET (FILE UPLOAD)</label>
              <input id="file-input" @change="handleFileChange" type="file" accept="image/*" class="text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-sonar-blue/10 file:text-sonar-blue hover:file:bg-sonar-blue/20" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">DESCRIPTION BRIEF</label>
              <textarea v-model="newProjectDesc" required class="bg-black/55 border border-sonar-blue/20 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono h-24" placeholder="Brief summary of the project..."></textarea>
            </div>

            <button type="submit" class="bg-sonar-blue text-black font-bold p-2 text-xs uppercase tracking-wider rounded font-mono hover:bg-sonar-blue/80 transition mt-2">
              Log Mission
            </button>

            <div v-if="projectStatus" class="text-[10px] font-bold text-center mt-1" :class="projectStatus.includes('ERR') ? 'text-red-500' : 'text-sonar-green'">
              {{ projectStatus }}
            </div>
          </form>
        </div>

        <!-- Project List (Right-side) -->
        <div class="lg:col-span-2 bg-black/40 border border-sonar-blue/20 p-6 rounded-md flex flex-col gap-4">
          <div>
            <h2 class="text-sm font-bold text-sonar-blue">Logged Expeditions</h2>
            <p class="text-[9px] text-gray-500">Missions registered in database logs.</p>
          </div>

          <div v-if="projects.length === 0" class="text-center py-12 text-xs text-gray-600 border border-dashed border-sonar-blue/10 rounded">
            NO PROJECTS REGISTERED IN LOGBOOK.
          </div>

          <div v-else class="flex flex-col gap-3">
            <div 
              v-for="project in projects" 
              :key="project.id"
              class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-abyss-950/60 p-4 border border-sonar-blue/10 rounded"
            >
              <div class="flex items-center gap-3">
                <div v-if="project.image_url" class="w-12 h-12 rounded border border-sonar-blue/20 overflow-hidden bg-black flex-shrink-0">
                  <img :src="project.image_url" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 rounded border border-dashed border-sonar-blue/20 flex items-center justify-center text-[8px] text-gray-600 flex-shrink-0 bg-black">
                  NO IMG
                </div>
                
                <div>
                  <div class="text-xs font-bold text-white">{{ project.title }}</div>
                  <div class="text-[9px] text-gray-400">
                    Order: {{ project.sort_order }} | Category: {{ project.category }} | Year: {{ project.year }}
                    <span v-if="project.location" class="text-sonar-blue font-bold"> | Location: {{ project.location }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions: EDIT LOG & DELETE LOG -->
              <div class="flex gap-2 flex-shrink-0">
                <button @click="openEditModal(project)" class="text-[9px] bg-sonar-blue/20 border border-sonar-blue/40 text-sonar-blue px-3 py-1 rounded hover:bg-sonar-blue/30 transition">
                  EDIT LOG
                </button>
                <button @click="deleteProject(project.id)" class="text-[9px] bg-red-950 border border-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-900/50 transition">
                  DELETE LOG
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- EDIT PROJECT MODAL -->
      <div v-if="isEditing" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="bg-abyss-950 border border-sonar-blue/40 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col gap-4 shadow-2xl">
          <div class="flex justify-between items-center border-b border-sonar-blue/20 pb-3">
            <div>
              <div class="text-[9px] text-sonar-blue font-bold">// UPDATE MISSION LOG</div>
              <div class="text-sm font-bold text-white">EDIT PROJECT DETAILS</div>
            </div>
            <button @click="isEditing = false" class="text-gray-400 hover:text-white text-lg">✕</button>
          </div>

          <form @submit.prevent="updateProject" class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">MISSION NAME (TITLE)</label>
              <input v-model="editTitle" type="text" required class="bg-black/60 border border-sonar-blue/25 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">CATEGORY (E.G. WEB, MOBILE, SYSTEM)</label>
              <input v-model="editCategory" type="text" required class="bg-black/60 border border-sonar-blue/25 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-sonar-blue font-bold">LOCATION / CONTEXT (OPTIONAL)</label>
              <input v-model="editLocation" type="text" class="bg-black/60 border border-sonar-blue/40 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" placeholder="e.g. Intern at PT Telkom / Lomba HackFest / Freelance" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">YEAR (E.G. 2026)</label>
              <input v-model="editYear" type="text" required class="bg-black/60 border border-sonar-blue/25 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">UPLINK ADDRESS (URL LINK)</label>
              <input v-model="editLink" type="url" class="bg-black/60 border border-sonar-blue/25 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">SORT PRIORITY ORDER</label>
              <input v-model="editSort" type="number" required class="bg-black/60 border border-sonar-blue/25 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">REPLACE IMAGE PACKET (OPTIONAL UPLOAD)</label>
              <input @change="handleEditFileChange" type="file" accept="image/*" class="text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-sonar-blue/10 file:text-sonar-blue hover:file:bg-sonar-blue/20" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] text-gray-400">DESCRIPTION BRIEF</label>
              <textarea v-model="editDesc" required class="bg-black/60 border border-sonar-blue/25 p-2 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono h-28"></textarea>
            </div>

            <div class="flex justify-between items-center mt-2">
              <button type="button" @click="isEditing = false" class="border border-white/20 text-gray-400 px-4 py-2 text-xs rounded hover:bg-white/10 transition">
                CANCEL
              </button>
              <button type="submit" class="bg-sonar-blue text-black font-bold px-6 py-2 text-xs uppercase tracking-wider rounded font-mono hover:bg-sonar-blue/80 transition">
                SAVE CHANGES
              </button>
            </div>

            <div v-if="editStatus" class="text-[10px] font-bold text-center mt-1" :class="editStatus.includes('ERR') ? 'text-red-500' : 'text-sonar-green'">
              {{ editStatus }}
            </div>
          </form>
        </div>
      </div>

      <!-- Tab 3: Messages -->
      <div v-if="activeTab === 'messages'" class="bg-black/40 border border-sonar-blue/20 p-6 rounded-md flex flex-col gap-6">
        <div>
          <h2 class="text-lg font-bold text-sonar-blue">Incoming Hydrophone Comms Log</h2>
          <p class="text-[10px] text-gray-400">Messages transmitted from client portal nodes.</p>
        </div>

        <div v-if="messages.length === 0" class="text-center py-16 text-xs text-gray-600 border border-dashed border-sonar-blue/10 rounded">
          NO ACTIVE HYDROPHONE SIGNALS ACQUIRED.
        </div>

        <div v-else class="flex flex-col gap-4">
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            class="bg-abyss-950/60 border border-sonar-blue/10 p-5 rounded flex flex-col gap-3 relative"
          >
            <!-- Header -->
            <div class="flex justify-between items-start border-b border-sonar-blue/10 pb-2">
              <div>
                <span class="text-xs text-sonar-blue font-bold">{{ msg.name }}</span>
                <span class="text-gray-500 text-[10px] ml-2">&lt;{{ msg.email }}&gt;</span>
              </div>
              <div class="text-[9px] text-gray-400">
                {{ new Date(msg.created_at).toLocaleString() }}
              </div>
            </div>

            <!-- Content -->
            <p class="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
              {{ msg.message }}
            </p>

            <!-- Actions -->
            <div class="flex justify-end mt-2">
              <button @click="deleteMessage(msg.id)" class="text-[9px] bg-red-950 border border-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-900/50 transition">
                CLEAR SIGNAL PACKET
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
