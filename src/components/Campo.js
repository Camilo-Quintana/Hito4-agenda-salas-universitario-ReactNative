// Campo de texto con etiqueta y mensaje de error debajo. El borde se marca en burdeo mientras se escribe.
import { forwardRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colores, radio, tipografia } from '../theme'

const Campo = forwardRef(function Campo({ etiqueta, error, ayuda, estilo, onFocus, onBlur, ...props }, ref) {
  const [enfocado, setEnfocado] = useState(false)
  return (
    <View style={[styles.contenedor, estilo]}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          props.multiline && styles.multilinea,
          enfocado && styles.inputEnfocado,
          error && styles.inputError,
        ]}
        placeholderTextColor={colores.textoSuave}
        selectionColor={colores.primarioClaro}
        cursorColor={colores.primario}
        accessibilityLabel={etiqueta}
        onFocus={(e) => {
          setEnfocado(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setEnfocado(false)
          onBlur?.(e)
        }}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : ayuda ? <Text style={styles.ayuda}>{ayuda}</Text> : null}
    </View>
  )
})

export default Campo

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { ...tipografia.etiqueta, color: colores.texto },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.blanco,
  },
  multilinea: { minHeight: 96, paddingTop: 12, textAlignVertical: 'top' },
  // el borde pasa de 1 a 2: se compensa el relleno para que el texto no salte
  inputEnfocado: { borderColor: colores.primario, borderWidth: 2, paddingHorizontal: 13 },
  inputError: { borderColor: colores.peligro },
  error: { ...tipografia.cuerpoChico, color: colores.peligro },
  ayuda: { ...tipografia.cuerpoChico, color: colores.textoSuave },
})
