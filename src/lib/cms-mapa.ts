const COLOR_POR_DEFECTO = '#f55745'

export type MiembroVista = {
  id: number
  slug: string
  nombre: string
  titulo: string
  color: string
  colorDark: string
  colorDarken: string
  activo: boolean
  imagen: string
  presentacion: string
  direccion: string
  nacimiento: string
  whatsapp: string
  mail: string
  conocimientos: string[][]
  conocimientos_p: number[][]
  educacion_a: string[]
  educacion_i: string[]
  educacion_t: string[]
  educacion_d: string[]
  experiencia_a: string[]
  experiencia_t: string[]
  experiencia_s: string[]
  experiencia_d: string[]
}

export type TrabajoVista = {
  id: number
  imagen: string
  mini: string
  width: number | null
  height: number | null
  titulo: string
  descripcion: string
  categoria: string
}

export type ServicioVista = {
  id: number
  icono: string
  titulo: string
  descripcion: string
}

type MediaDoc = {
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    mini?: { url?: string | null; width?: number | null; height?: number | null }
    card?: { url?: string | null; width?: number | null; height?: number | null }
  }
}

function texto(valor: unknown): string {
  if (typeof valor === 'string') return valor
  if (typeof valor === 'number' && Number.isFinite(valor)) return String(valor)
  return ''
}

function numero(valor: unknown): number | null {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : null
}

function campo(item: unknown, nombre: string): string {
  if (!item || typeof item !== 'object') return ''
  return texto((item as Record<string, unknown>)[nombre])
}

function esMedia(valor: unknown): valor is MediaDoc {
  return Boolean(valor && typeof valor === 'object' && ('url' in valor || 'sizes' in valor))
}

/** Oscurece un hex como el `adjustColor` del portfolio PHP (`-30` y `-60`). */
export function ajustarColor(color: string, porcentaje: number): string {
  const limpio = color.trim().replace('#', '')
  const hex =
    limpio.length === 3 ? limpio.split('').map((caracter) => caracter + caracter).join('') : limpio
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return COLOR_POR_DEFECTO
  const canales = [0, 2, 4].map((inicio) => parseInt(hex.slice(inicio, inicio + 2), 16))
  const ajustados = canales.map((canal) => {
    const valor = Math.round((canal * (100 + porcentaje)) / 100)
    return Math.min(255, Math.max(0, valor))
  })
  return `#${ajustados.map((valor) => valor.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Arma la URL del archivo. Las rutas relativas se prefijan con el CMS.
 * `/api/media/` absoluto se reescribe a ese mismo origen: en local el CMS
 * a veces devuelve el host de `NEXT_PUBLIC_SERVER_URL` y el archivo está en el proceso local.
 */
export function urlAbsoluta(base: string, ruta: string | null | undefined): string {
  if (!ruta) return ''
  let origen: URL
  try {
    origen = new URL(base.endsWith('/') ? base : `${base}/`)
  } catch {
    return /^https?:\/\//i.test(ruta) ? ruta : ''
  }

  if (/^https?:\/\//i.test(ruta)) {
    try {
      const absoluta = new URL(ruta)
      if (absoluta.pathname.startsWith('/api/media/')) {
        absoluta.protocol = origen.protocol
        absoluta.host = origen.host
      }
      return absoluta.href
    } catch {
      return ruta
    }
  }

  try {
    return new URL(ruta, origen).href
  } catch {
    return ''
  }
}

function urlDeMedia(base: string, media: unknown, tamano?: 'mini' | 'card'): string {
  if (!esMedia(media)) return ''
  const especifica = tamano ? media.sizes?.[tamano]?.url : undefined
  return urlAbsoluta(base, especifica || media.url || '')
}

/**
 * El PHP partía la lista en grupos de `floor(n / 2)`:
 * la columna izquierda muestra el grupo 0 y el 2, la derecha el 1.
 */
function partir<T>(items: T[]): T[][] {
  if (items.length === 0) return []
  const tamano = Math.floor(items.length / 2)
  if (tamano <= 0) return [items]
  const grupos: T[][] = []
  for (let i = 0; i < items.length; i += tamano) grupos.push(items.slice(i, i + tamano))
  return grupos
}

export function mapearMiembro(doc: unknown, base: string): MiembroVista | null {
  if (!doc || typeof doc !== 'object') return null
  const data = doc as Record<string, unknown>
  const id = numero(data.id)
  const slug = texto(data.slug).trim()
  if (id == null || !slug || slug.includes('/')) return null

  const color = texto(data.color).trim() || COLOR_POR_DEFECTO
  const conocimientos = (Array.isArray(data.conocimientos) ? data.conocimientos : [])
    .map((item) => ({
      nombre: campo(item, 'nombre'),
      porcentaje: numero((item as { porcentaje?: unknown })?.porcentaje) ?? 0,
    }))
    .filter((item) => item.nombre)
  const nombres = conocimientos.map((item) => item.nombre)
  const porcentajes = conocimientos.map((item) => item.porcentaje)
  const educacion = Array.isArray(data.educacion) ? data.educacion : []
  const experiencia = Array.isArray(data.experiencia) ? data.experiencia : []

  return {
    id,
    slug,
    nombre: texto(data.nombre),
    titulo: texto(data.titulo),
    color,
    colorDark: ajustarColor(color, -30),
    colorDarken: ajustarColor(color, -60),
    activo: data.activo !== false,
    imagen: urlDeMedia(base, data.foto),
    presentacion: texto(data.presentacion),
    direccion: texto(data.direccion),
    nacimiento: texto(data.nacimiento),
    whatsapp: texto(data.whatsapp),
    mail: texto(data.email),
    conocimientos: partir(nombres),
    conocimientos_p: partir(porcentajes),
    educacion_a: educacion.map((item) => campo(item, 'anio')),
    educacion_i: educacion.map((item) => campo(item, 'lugar')),
    educacion_t: educacion.map((item) => campo(item, 'titulo')),
    educacion_d: educacion.map((item) => campo(item, 'descripcion')),
    experiencia_a: experiencia.map((item) => campo(item, 'anio')),
    experiencia_t: experiencia.map((item) => campo(item, 'trabajo')),
    experiencia_s: experiencia.map((item) => campo(item, 'lugar')),
    experiencia_d: experiencia.map((item) => campo(item, 'descripcion')),
  }
}

export function mapearTrabajo(doc: unknown, base: string): TrabajoVista | null {
  if (!doc || typeof doc !== 'object') return null
  const data = doc as Record<string, unknown>
  const id = numero(data.id)
  if (id == null) return null
  const media = data.imagen
  return {
    id,
    imagen: urlDeMedia(base, media),
    mini: urlDeMedia(base, media, 'mini') || urlDeMedia(base, media, 'card') || urlDeMedia(base, media),
    width: esMedia(media) ? numero(media.width) : null,
    height: esMedia(media) ? numero(media.height) : null,
    titulo: texto(data.titulo),
    descripcion: texto(data.descripcion),
    categoria: texto(data.categoria).trim(),
  }
}

export function categoriasDe(trabajos: TrabajoVista[]): string[] {
  const vistas = new Set<string>()
  const categorias: string[] = []
  for (const trabajo of trabajos) {
    if (!trabajo.categoria || vistas.has(trabajo.categoria)) continue
    vistas.add(trabajo.categoria)
    categorias.push(trabajo.categoria)
  }
  return categorias
}

export function mapearServicio(doc: unknown): ServicioVista | null {
  if (!doc || typeof doc !== 'object') return null
  const data = doc as Record<string, unknown>
  const id = numero(data.id)
  if (id == null) return null
  return {
    id,
    icono: texto(data.icono),
    titulo: texto(data.titulo),
    descripcion: texto(data.descripcion),
  }
}
