// Hook para consultar la API desde una pantalla. Mismo patrón que useClima de la web:
// el estado de "cargando" no se guarda con un setState, se calcula comparando qué consulta
// se pidió con qué consulta respondió la API.
//
// Devuelve:
//   datos, error
//   cargando    -> primera carga o cambio de filtros (se muestra el indicador grande)
//   refrescando -> el usuario tiró la lista hacia abajo (pull to refresh)
//   recargar(), refrescar(), actualizarSilencioso() -> vuelven a pedir los datos
//
// Si la pantalla se cierra o cambian los filtros antes de que llegue la respuesta, la petición
// anterior se cancela con AbortController para no mostrar datos viejos.
import { useEffect, useRef, useState } from 'react'

export function useConsulta(funcion, dependencias) {
  // "clave" identifica la consulta (por ejemplo, los filtros). Si cambia, se vuelve a pedir.
  const clave = JSON.stringify(dependencias)
  const [pedido, setPedido] = useState({ version: 0, modo: 'inicial' })
  const [resultado, setResultado] = useState({ clave: null, pedida: null, datos: null, error: null })

  // Siempre se usa la versión más reciente de la función (puede leer filtros nuevos)
  const funcionRef = useRef(funcion)
  useEffect(() => {
    funcionRef.current = funcion
  })

  const pedida = `${clave}#${pedido.version}`

  useEffect(() => {
    const control = new AbortController()
    funcionRef.current(control.signal).then(
      (datos) => setResultado({ clave, pedida, datos, error: null }),
      (error) => {
        if (control.signal.aborted) return // se canceló a propósito
        // si falla un refresco se conservan los datos que ya se mostraban
        setResultado((anterior) => ({ clave, pedida, datos: anterior.clave === clave ? anterior.datos : null, error }))
      },
    )
    return () => control.abort()
  }, [clave, pedida])

  const pendiente = resultado.pedida !== pedida
  const mismaConsulta = resultado.clave === clave // solo se está repitiendo, no cambiaron los filtros
  const refrescando = pendiente && mismaConsulta && pedido.modo === 'refrescar'
  const cargando = pendiente && !(mismaConsulta && pedido.modo !== 'inicial')

  const repetir = (modo) => setPedido((anterior) => ({ version: anterior.version + 1, modo }))

  return {
    datos: resultado.datos,
    error: pendiente && !mismaConsulta ? null : resultado.error,
    cargando,
    refrescando,
    recargar: () => repetir('inicial'),
    refrescar: () => repetir('refrescar'),
    actualizarSilencioso: () => repetir('silencioso'),
  }
}
