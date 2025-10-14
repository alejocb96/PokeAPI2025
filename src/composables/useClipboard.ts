import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  const error = ref<string | null>(null)

  /**
   * Copia texto al portapapeles
   */
  async function copyToClipboard(text: string): Promise<boolean> {
    error.value = null
    copied.value = false

    try {
      // Intentar usar la API moderna del navegador
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
        return true
      }

      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      textArea.remove()

      if (successful) {
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
        return true
      }

      throw new Error('Copy command was unsuccessful')
    } catch (err) {
      error.value = 'No se pudo copiar al portapapeles'
      console.error('Failed to copy:', err)
      return false
    }
  }

  return {
    copied,
    error,
    copyToClipboard
  }
}

