// Ejecuta una función cada vez que el usuario vuelve a una pantalla (por ejemplo, después de reservar
// o cancelar), para que los datos estén al día. La primera vez no hace nada: ahí ya cargó useConsulta.
import { useCallback, useEffect, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'

export function useAlVolver(funcion) {
  const primeraVez = useRef(true)
  const funcionRef = useRef(funcion)
  useEffect(() => {
    funcionRef.current = funcion
  })

  useFocusEffect(
    useCallback(() => {
      if (primeraVez.current) {
        primeraVez.current = false
        return
      }
      funcionRef.current()
    }, []),
  )
}
