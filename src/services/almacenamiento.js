// Dónde se guarda la sesión. En el teléfono, en el almacenamiento seguro (Keychain en iOS,
// Keystore en Android) con expo-secure-store. SecureStore no existe en el navegador,
// así que en "npm run web" (solo para probar) se usa localStorage.
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const enWeb = Platform.OS === 'web'

export const almacenamiento = {
  leer: (clave) => (enWeb ? Promise.resolve(globalThis.localStorage?.getItem(clave) ?? null) : SecureStore.getItemAsync(clave)),
  guardar: (clave, valor) => (enWeb ? Promise.resolve(globalThis.localStorage?.setItem(clave, valor)) : SecureStore.setItemAsync(clave, valor)),
  borrar: (clave) => (enWeb ? Promise.resolve(globalThis.localStorage?.removeItem(clave)) : SecureStore.deleteItemAsync(clave)),
}
