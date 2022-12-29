/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/
let mapa //Referencia del mapa.
let latitud = 41.670141205551865 //Latitud de inicio del centro del mapa.
let longitud = -3.689933230224045 //Longitud de inicio del centro del mapa.
let coordenadasValidas = true //Flag para controlar si las coordenadas son válidas con el fin de poner el marcador en el mapa.
let marcadores = []
let posicionGeolocalizacion //Geolocalización.

//--------------------------------------------------------------------------------------------------
//Función de inicio. Representa el mapa en el contenedor de la interfaz.
function mostrarMapa() {
  mapa = new google.maps.Map(document.getElementById('mapa_canvas'), {
    // En el mapa se visualiza el mapa correspondiente a esta latitud, longitud
    center: new google.maps.LatLng(latitud, longitud), //El mapa se visualiza centrado en las coordenadas de latitud y longitud pasadas como argumento
    zoom: 18, //Zoom del mapa
    draggableCursor: 'auto', //El nombre o la URL del cursor que se muestra al desplazar el mouse sobre un mapa arrastrable.
    draggingCursor: 'crosshair', //El nombre o la URL del cursor que se muestra cuando se arrastra el mapa.
    mapTypeId: google.maps.MapTypeId.SATELLITE, //Tipo de mapa.
  })

  añadirEventoClickMapa()
}

//------------------------------------------------------------------------------------------------
//Referencia al icono de inicio. Define sus propiedades.
let iconoInicio = {
  url: './images/MarcadorInicio.png', //Imagen del marcador de posición.
  scaledSize: new google.maps.Size(50, 50), //Tamaño escala.
  origin: new google.maps.Point(0, 0), //Origen imagen.
  anchor: new google.maps.Point(25, 50), //Punto de anclaje
}

//--------------------------------------------------------------------------------------------------
//Añade escuchador del evento click sobre el mapa
function añadirEventoClickMapa() {
  google.maps.event.addListener(mapa, 'click', function (event) {})
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
          alert('Resultado no encontrado.')
        }
      } else {
        alert('El geocodificador falló debido a:' + status)
      }
    })
  }
}

//--------------------------------------------------------------------------------------------------
//Función que muestra la dirección en la interfaz.
function mostrarDireccion(latlng, direccion) {
  iDireccion.value = direccion
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
  let marcador = new google.maps.Marker({
    icon: iconoInicio,
    position: geolocalizacion,
    map: mapa,
  })
  marcadores.push(marcador)
  leerDireccion(geolocalizacion)
  mapa.setCenter(geolocalizacion)
}

//--------------------------------------------------------------------------------------------------
//Escribe la dirección en la parte inferior del mapa.
function mostrarDireccionDebajoMapa(direccion) {
  direccionMapa.innerText = direccion
}

//--------------------------------------------------------------------------------------------------
//Calcular la distancia al punto de origen del mapa.
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
  timeout: 900, //Tiempo máximo en milisegundos que el dispositivo puede tardar para devolver una posición.
  maximumAge: 0, //Establece que el dispositivo no puede utilizar una posición de almacenamiento en caché.
}

//--------------------------------------------------------------------------------------------------
//Muestra el error de la geolocalización.
function errorGeolocalizacion(error) {
  //let mensajeError = 'Error ' + error.code + ': ' + error.message
  //mostrarVentanaEmergente(mensajeError, 'error')
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
    primeraMuestra = false
    trazarLinea()
  }
}

//--------------------------------------------------------------------------------------------------
//Traza una línea entre dos puntos en el mapa.
function trazarLinea() {
  if (!primeraMuestra) {
    let trazado = [] //Trazado con las coordenadas de los marcadores.
    let colorTrazo = 'blue'
    let grosorTrazo = 1

    for (const marcador of marcadores) {
      trazado.push(marcador.position)
    }
    console.log(trazado)
    // Crear un objeto Polyline que define las propiedades de la linea a dibujar
    var ruta = new google.maps.Polyline({
      path: trazado,
      strokeColor: colorTrazo,
      strokeOpacity: 2,
      strokeWeight: grosorTrazo,
      geodesic: true,
    })

    // Esta funcion dibuja el Polyline creado en el mama
    eval(ruta).setMap(mapa)
  }
}

//--------------------------------------------------------------------------------------------------
//Llamada a la función que muestra el mapa.
mostrarMapa() //Muestra el mapa.

//------------------------------------------------------------------------------