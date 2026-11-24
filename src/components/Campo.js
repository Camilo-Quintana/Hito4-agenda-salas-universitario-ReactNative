// Campo de texto con etiqueta y mensaje de error debajo
import { forwardRef } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colores, radio } from '../theme'

const Campo = forwardRef(function Campo({ etiqueta, error, ayuda, estilo, ...props }, ref) {
  return (
    <View style={[styles.contenedor, estilo]}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, props.multiline && styles.multilinea, error && styles.inputError]}
        placeholderTextColor={colores.ocupado}
        accessibilityLabel={etiqueta}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : ayuda ? <Text style={styles.ayuda}>{ayuda}</Text> : null}
    </View>
  )
})

export default Campo

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto },
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
  inputError: { borderColor: colores.peligro },
  error: { fontSize: 13, color: colores.peligro },
  ayuda: { fontSize: 13, color: colores.textoSuave },
})
