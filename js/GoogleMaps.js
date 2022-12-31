/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/
let mapa //Referencia del mapa.
let latitud = 41.670141205551865 //Latitud de inicio del centro del mapa.
let longitud = -3.689933230224045 //Longitud de inicio del centro del mapa.
let coordenadasValidas = true //Flag para controlar si las coordenadas son válidas con el fin de poner el marcador en el mapa.
let marcadores = [] //Marcadores de posición del mapa.
let ruta = null //Trazado de la ruta.
let posicionGeolocalizacion //Geolocalización.

//--------------------------------------------------------------------------------------------------
//Función de inicio. Representa el mapa en el contenedor de la interfaz.
function mostrarMapa() {
  mapa = new google.maps.Map(document.getElementById('mapa_canvas'), {
    // En el mapa se visualiza el mapa correspondiente a esta latitud, longitud
    center: new google.maps.LatLng(latitud, longitud), //El mapa se visualiza centrado en las coordenadas de latitud y longitud pasadas como argumento
    zoom: parseInt(iZoom.value), //Zoom del mapa
    draggableCursor: 'auto', //El nombre o la URL del cursor que se muestra al desplazar el mouse sobre un mapa arrastrable.
    draggingCursor: 'crosshair', //El nombre o la URL del cursor que se muestra cuando se arrastra el mapa.
    mapTypeId: google.maps.MapTypeId.SATELLITE, //Tipo de mapa.
  })
}

//------------------------------------------------------------------------------------------------
//Referencia al icono de inicio de la ruta. Define sus propiedades.
let iconoInicio = {
  url: './images/MarcadorInicio.png', //Imagen del marcador de posición.
  scaledSize: new google.maps.Size(50, 50), //Tamaño escala.
  origin: new google.maps.Point(0, 0), //Origen imagen.
  anchor: new google.maps.Point(25, 50), //Punto de anclaje
}

//--------------------------------------------------------------------------------------------------
//Referencia al icono de fin de de la ruta. Define sus propiedades.
let iconoFin = {
  url: './images/MarcadorFin.png', //Imagen del marcador de posición.
  scaledSize: new google.maps.Size(50, 50), //Tamaño escala.
  origin: new google.maps.Point(0, 0), //Origen imagen.
  anchor: new google.maps.Point(25, 50), //Punto de anclaje
}

//--------------------------------------------------------------------------------------------------
//Referencia al icono del punto intermedio de la ruta. Define sus propiedades.
let iconoPuntoIntermedio = {
  url: './images/PuntoIntermedio.png', //Imagen del marcador de posición.
  scaledSize: new google.maps.Size(12, 12), //Tamaño escala.
  origin: new google.maps.Point(0, 0), //Origen imagen.
  anchor: new google.maps.Point(6, 6), //Punto de anclaje
}

//--------------------------------------------------------------------------------------------------
// Obtiene la dirección, longitud y latitud correspondiente al punto donde se ha hecho clic y los muestra en la interfaz.
function leerDireccion(latlng) {
  //Crea objeto Geocoder.
  //La API de Geocoding de Google nos provee de dos servicios fundamentales:
  //Nos permite convertir direcciones como Calle de la Plata 25, 28021 Madrid en unas coordenadas geográficas de latitud y longitud (40.3487, -3.7056) que podemos usar, por ejemplo, para marcar un punto concreto de un mapa.
  //El servicio inverso, es decir, dadas unas coordenadas geográficas obtener la dirección de calle, número, … a la que corresponde (Geocoding inverso).
  let geocoder = new google.maps.Geocoder()
  //Si la latitud y longitud no son nulas.
  if (latlng != null) {
    geocoder.geocode({ latLng: latlng }, function (results, status) {
      //Si el status del objeto geocoder es OK.
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          //Mostramos la dirección
          mostrarDireccion(latlng, results[0].formatted_address)
        } else {
          //alert('Resultado no encontrado.')
        }
      } else {
        //alert('El geocodificador falló debido a:' + status)
      }
    })
  }
}

//--------------------------------------------------------------------------------------------------
//Función que muestra la dirección en la interfaz.
function mostrarDireccion(latlng, direccion) {
  iDireccion.value = direccion
  añadirDireccion(latlng, direccion)
}

//--------------------------------------------------------------------------------------------------
//Función que realiza el borrado de los marcadores. Para poder borrar los marcadores es necesario almacenarlos en un array.
function borrarMarcadores() {
  // Elimina los marcadores de una consulta anterior
  for (var i = 0; i < marcadores.length; i++) {
    marcadores[i].setMap(null)
  }
  marcadores = new Array() //Crea una nueva referancia.
}

//--------------------------------------------------------------------------------------------------
// Añadir un marcador al mapa.
function añadirMarcador(geolocalizacion) {
  let marcador = null

  if (primeraMuestra) {
    icono = iconoInicio
  } else if (ultimaMuestra) {
    icono = iconoFin
  } else {
    icono = iconoPuntoIntermedio
  }

  let distanciaEntrePuntos = 0
  //Si no es la primera muestra. Calcula la distancia en metros con respecto al punto anterior.
  if (!primeraMuestra && !ultimaMuestra) {
    distanciaEntrePuntos =
      Math.round(
        calcularDistancia2Puntos(
          geolocalizacion,
          marcadores[marcadores.length - 1].position,
        ) * 100,
      ) / 100
  //Si es la última muestra.
  } else if (ultimaMuestra) {
    if (marcadores.length > 0) {
      geolocalizacion = marcadores[marcadores.length - 1].position
      distanciaEntrePuntos =
        Math.round(
          calcularDistancia2Puntos(
            marcadores[marcadores.length - 2].position,
            geolocalizacion,
          ) * 100,
        ) / 100
    }
    marcadores.pop()  //Elimina el último elemento del array.
  }

  //Si es la primera o última muestra, o cualquier otra posición a una distancia con el punto anterior igual o superior la distancia mínima.
  if (
    primeraMuestra ||
    ultimaMuestra ||
    (!primeraMuestra && distanciaEntrePuntos >= distanciaMinima)
  ) {
    marcador = new google.maps.Marker({
      icon: icono,
      position: geolocalizacion,
      map: mapa,
      hora: obtenerHoraActual(),
      fecha: obtenerFechaActual(),
      distancia: distanciaEntrePuntos,
    })

    //Añade el evento click al marcador.
    google.maps.event.addListener(
      marcador,
      'click',
      function () {
        mostrarInformacionMarcador(marcador)
      },
      false,
    )
    marcadores.push(marcador)
    leerDireccion(geolocalizacion)
    mapa.setCenter(geolocalizacion)
  }
}

//--------------------------------------------------------------------------------------------------
//Calcular la distancia entre dos puntos en metros.
function calcularDistancia2Puntos(posicionInicial, posicionFinal) {
  return (distancia = google.maps.geometry.spherical.computeDistanceBetween(
    posicionInicial,
    posicionFinal,
  ))
}

//--------------------------------------------------------------------------------------------------
//Opciones de geolocalización.
const opcionesGeolocalizacion = {
  enableHighAccuracy: true, //Indica que la aplicación recibirá los mejores resultados posibles.
  maximumAge: 0, //Establece que el dispositivo no puede utilizar una posición de almacenamiento en caché.
}

//--------------------------------------------------------------------------------------------------
//Muestra el error de la geolocalización.
function errorGeolocalizacion(error) {
  let mensajeError = 'Error ' + error.code + ': ' + error.message
  mostrarVentanaEmergente(mensajeError, 'error')
}

//--------------------------------------------------------------------------------------------------
//Obtener la localización actual del dispositivo.
function capturarGeolocalizacion() {
  navigator.geolocation.getCurrentPosition(
    (posicion) => {
      //console.log(posicion.coords.latitude+","+ posicion.coords.latitude)
      posicionGeolocalizacion = new google.maps.LatLng(
        posicion.coords.latitude,
        posicion.coords.longitude,
      )
    },
    errorGeolocalizacion,
    opcionesGeolocalizacion,
  )

  if (posicionGeolocalizacion) {
    añadirMarcador(posicionGeolocalizacion)
    if (!primeraMuestra) {
      trazarLinea()
    } else {
      reproducirMensaje('Iniciando toma de datos.')
      primeraMuestra = false
    }
  }
}

//--------------------------------------------------------------------------------------------------
//Traza una línea entre dos puntos en el mapa.
function trazarLinea() {
  if (!primeraMuestra || actualizaTrazado) {
    let trazado = [] //Trazado con las coordenadas de los marcadores.
    let colorTrazo = iColor.value //Color del trazo.
    let grosorTrazo = parseInt(iAncho.value) //Ancho del trazo.

    for (const marcador of marcadores) {
      trazado.push(marcador.position)
    }

    borrarTrazado()
    // Crear un objeto Polyline que define las propiedades de la linea a dibujar
    ruta = new google.maps.Polyline({
      path: trazado,
      strokeColor: colorTrazo,
      strokeOpacity: 2,
      strokeWeight: grosorTrazo,
      geodesic: true,
    })

    //Dibuja el Polyline creado en el mapa
    ruta.setMap(mapa)
  }
}

//--------------------------------------------------------------------------------------------------
//Borra las lineas del trazado
function borrarTrazado() {
  if (ruta) {
    ruta.setMap(null)
  }
}

//--------------------------------------------------------------------------------------------------
//Llamada a la función que muestra el mapa.
mostrarMapa() //Muestra el mapa.
