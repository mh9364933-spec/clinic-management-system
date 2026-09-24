<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({
  name: '',
  specialty: '',
  email: '',
  phone: '',
  avatarUrl: '',
})

const avatarFile = ref(null)
const avatarPreview = ref('')
const errors = reactive({})

function close() {
  emit('update:modelValue', false)
}

function onAvatarFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = () => {
    avatarPreview.value = reader.result
  }
  reader.readAsDataURL(file)
}

function validate() {
  errors.name = form.name.trim() ? '' : 'Full name is required'
  errors.specialty = form.specialty.trim() ? '' : 'Specialty is required'
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'A valid email is required'
  return !Object.values(errors).some(Boolean)
}

function handleSubmit() {
  if (!validate()) return

  const avatar = avatarPreview.value || form.avatarUrl || undefined

  emit('submit', {
    name: form.name,
    specialty: form.specialty,
    email: form.email,
    phone: form.phone,
    avatar,
  })

  // reset for next time
  Object.assign(form, { name: '', specialty: '', email: '', phone: '', avatarUrl: '' })
  avatarFile.value = null
  avatarPreview.value = ''
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="login-overlay" @click.self="close">
        <Transition name="pop">
          <div v-if="modelValue" class="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <div class="login-card-header">
              <h2 id="login-title">Doctor Log In</h2>
              <button class="icon-btn" @click="close" aria-label="Close">✕</button>
            </div>
            <p class="login-card-subtitle">Enter your details to access the clinic dashboard.</p>

            <form class="login-form" @submit.prevent="handleSubmit">
              <div class="avatar-row">
                <img
                  v-if="avatarPreview || form.avatarUrl"
                  :src="avatarPreview || form.avatarUrl"
                  class="avatar-preview"
                  alt="Avatar preview"
                />
                <div v-else class="avatar-preview avatar-placeholder">DR</div>
                <div class="avatar-inputs">
                  <label class="field-label">Avatar</label>
                  <input
                    v-model="form.avatarUrl"
                    type="url"
                    placeholder="Image URL (optional)"
                    class="text-input"
                  />
                  <input type="file" accept="image/*" @change="onAvatarFile" class="file-input" />
                </div>
              </div>

              <div class="field">
                <label class="field-label" for="name">Full Name</label>
                <input id="name" v-model="form.name" type="text" placeholder="Dr. Ahmed" class="text-input" />
                <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
              </div>

              <div class="field">
                <label class="field-label" for="specialty">Specialty</label>
                <input id="specialty" v-model="form.specialty" type="text" placeholder="Cardiology" class="text-input" />
                <span v-if="errors.specialty" class="field-error">{{ errors.specialty }}</span>
              </div>

              <div class="field-row">
                <div class="field">
                  <label class="field-label" for="email">Email Address</label>
                  <input id="email" v-model="form.email" type="email" placeholder="doctor@clinic.com" class="text-input" />
                  <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
                </div>
                <div class="field">
                  <label class="field-label" for="phone">Phone Number</label>
                  <input id="phone" v-model="form.phone" type="tel" placeholder="+20 100 000 0000" class="text-input" />
                </div>
              </div>

              <div class="login-form-actions">
                <button type="button" class="btn-secondary" @click="close">Cancel</button>
                <button type="submit" class="btn-primary">Log In</button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* أسماء كلاسات فريدة (login-overlay / login-card / ...) بدل modal/overlay
   العامة عشان تتجنب أي تعارض مع Bootstrap أو أي مكتبة تانية محمّلة في المشروع
   بتعرّف كلاس اسمه .modal بـ display:none افتراضياً */

.login-overlay {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(15, 23, 42, 0.45);
  display: flex !important;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.login-card {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
  max-height: 90vh;
  overflow-y: auto;
}

.login-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-card-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.icon-btn {
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
}

.login-card-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 6px 0 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.avatar-preview {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: #dbeafe;
  flex-shrink: 0;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-weight: 700;
  font-size: 14px;
}

.avatar-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field,
.field-row .field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-row {
  display: flex;
  gap: 14px;
}

.field-row .field {
  flex: 1;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.text-input {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s;
}

.text-input:focus {
  border-color: #2563eb;
}

.file-input {
  font-size: 13px;
  color: #64748b;
}

.field-error {
  color: #dc2626;
  font-size: 12px;
}

.login-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.2s ease;
}
.pop-leave-active {
  transition: all 0.15s ease;
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

/* Tablet/mobile: stack the two-column row and tighten the modal padding */
@media (max-width: 560px) {
  .login-card {
    padding: 20px;
    border-radius: 14px;
    max-height: 95vh;
  }
  .field-row {
    flex-direction: column;
    gap: 16px;
  }
  .avatar-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .avatar-inputs {
    width: 100%;
  }
  .login-form-actions {
    flex-direction: column-reverse;
  }
  .login-form-actions button {
    width: 100%;
  }
}
</style>