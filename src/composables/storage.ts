import { ref } from 'vue'
export const isDev = ref(false)
export const toggleDev = useToggle(isDev)
