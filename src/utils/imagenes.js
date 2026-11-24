// Imagen de cada espacio (las mismas de la web). La API no guarda fotos: se eligen por categoría o tipo.
const IMAGEN_POR_TIPO = {
  Clases: require('../../assets/espacios/sala-clases.jpg'),
  Laboratorio: require('../../assets/espacios/laboratorio.jpg'),
  Reunión: require('../../assets/espacios/sala-reunion.jpg'),
  Estudio: require('../../assets/espacios/sala-estudio.jpg'),
  Exterior: require('../../assets/espacios/exterior.png'),
}

const IMAGEN_POR_CATEGORIA = {
  cientifico: require('../../assets/espacios/laboratorio-cientifico.jpg'),
}

const IMAGEN_POR_DEFECTO = require('../../assets/espacios/sala-default.jpg')

export function imagenDeEspacio(espacio) {
  return IMAGEN_POR_CATEGORIA[espacio.categoria] ?? IMAGEN_POR_TIPO[espacio.tipo] ?? IMAGEN_POR_DEFECTO
}
