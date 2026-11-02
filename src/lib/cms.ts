import {
  categoriasDe,
  mapearMiembro,
  mapearServicio,
  mapearTrabajo,
  type MiembroVista,
  type ServicioVista,
  type TrabajoVista,
} from './cms-mapa'

/** Puerto por defecto del CMS (`PORT` en cms/README.md de ManejoWeb). */
export const CMS_URL_POR_DEFECTO = 'http://localhost:3000'

const TIEMPO_MAXIMO_MS = 8000
const PAGINAS_MAXIMAS = 20

export type Resultado<T> = { ok: true; data: T } | { ok: false; error: string }

export type EquipoCargado =
  | { ok: true; miembros: MiembroVista[] }
  | { ok: false; error: string }

export type TrabajosCargados =
  | { ok: true; items: TrabajoVista[]; categorias: string[] }
  | { ok: false; error: string }

export type ServiciosCargados =
  | { ok: true; items: ServicioVista[] }
  | { ok: false; error: string }

type ListaPayload = {
  docs: unknown[]
  hasNextPage?: boolean
}

export function cmsUrl(): string {
  const configurada = import.meta.env.PUBLIC_CMS_URL
  if (typeof configurada === 'string' && configurada.trim()) {
    return configurada.trim().replace(/\/+$/, '')
  }
  return CMS_URL_POR_DEFECTO
}

function describirFallo(error: unknown): string {
  if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
    return 'La API no respondió a tiempo.'
  }
  const codigo =
    error instanceof Error && error.cause && typeof error.cause === 'object' && 'code' in error.cause
      ? String((error.cause as { code?: unknown }).code)
      : ''
  if (codigo === 'ECONNREFUSED' || codigo === 'ENOTFOUND' || codigo === 'EAI_AGAIN') {
    return 'No hay nada escuchando en esa URL.'
  }
  return 'No se pudo conectar con la API.'
}

async function leerJson(url: URL): Promise<Resultado<unknown>> {
  const controlador = new AbortController()
  const aviso = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS)
  try {
    const respuesta = await fetch(url, {
      signal: controlador.signal,
      headers: { Accept: 'application/json' },
    })
    if (!respuesta.ok) {
      return { ok: false, error: `La API respondió HTTP ${respuesta.status}.` }
    }
    return { ok: true, data: await respuesta.json() }
  } catch (error) {
    return { ok: false, error: describirFallo(error) }
  } finally {
    clearTimeout(aviso)
  }
}

function esLista(data: unknown): data is ListaPayload {
  return Boolean(data && typeof data === 'object' && Array.isArray((data as ListaPayload).docs))
}

async function leerColeccion(
  slug: string,
  params: Record<string, string>,
): Promise<Resultado<unknown[]>> {
  let base: URL
  try {
    base = new URL(cmsUrl())
  } catch {
    return { ok: false, error: 'PUBLIC_CMS_URL no es una URL válida.' }
  }

  const docs: unknown[] = []
  for (let page = 1; page <= PAGINAS_MAXIMAS; page++) {
    const url = new URL(`/api/${slug}`, base)
    for (const [clave, valor] of Object.entries(params)) url.searchParams.set(clave, valor)
    url.searchParams.set('limit', '100')
    url.searchParams.set('page', String(page))

    const resultado = await leerJson(url)
    if (!resultado.ok) {
      console.warn(`[cms] ${url.pathname}: ${resultado.error}`)
      return resultado
    }
    if (!esLista(resultado.data)) {
      const error = 'La API devolvió un formato inesperado.'
      console.warn(`[cms] ${url.pathname}: ${error}`)
      return { ok: false, error }
    }
    docs.push(...resultado.data.docs)
    if (resultado.data.hasNextPage !== true) break
  }
  return { ok: true, data: docs }
}

let equipoEnCurso: Promise<EquipoCargado> | null = null

export function leerEquipo(): Promise<EquipoCargado> {
  if (!equipoEnCurso) equipoEnCurso = pedirEquipo()
  return equipoEnCurso
}

async function pedirEquipo(): Promise<EquipoCargado> {
  const resultado = await leerColeccion('equipo', {
    'where[activo][equals]': 'true',
    depth: '1',
    sort: 'id',
  })
  if (!resultado.ok) return resultado
  const miembros = resultado.data
    .map((doc) => mapearMiembro(doc, cmsUrl()))
    .filter((miembro): miembro is MiembroVista => miembro != null)
  return { ok: true, miembros }
}

export async function leerTrabajos(miembroId: number): Promise<TrabajosCargados> {
  const resultado = await leerColeccion('trabajos', {
    'where[miembro][equals]': String(miembroId),
    depth: '1',
    sort: 'id',
  })
  if (!resultado.ok) return resultado
  const items = resultado.data
    .map((doc) => mapearTrabajo(doc, cmsUrl()))
    .filter((trabajo): trabajo is TrabajoVista => trabajo != null)
  return { ok: true, items, categorias: categoriasDe(items) }
}

export async function leerServicios(miembroId: number): Promise<ServiciosCargados> {
  const resultado = await leerColeccion('servicios', {
    'where[miembro][equals]': String(miembroId),
    depth: '0',
    sort: 'id',
  })
  if (!resultado.ok) return resultado
  const items = resultado.data
    .map((doc) => mapearServicio(doc))
    .filter((servicio): servicio is ServicioVista => servicio != null)
  return { ok: true, items }
}
