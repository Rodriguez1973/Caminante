let mapa //Referencia del mapa.
let latitud = 41.670141205551865 //Latitud de inicio de centrado del mapa.
let longitud = -3.689933230224045 //Longitud de inicio del centro del mapa.
let coordenadasValidas = true //Flag para controlar si las coordenadas son válidas con el fin de poner el marcador en el mapa.
let marcadores = new Array()

//--------------------------------------------------------------------------------------------------
//Función de inicio. Representa el mapa en el contenedor de la interfaz.
function mostrarMapa() {
  mapa = new google.maps.Map(document.getElementById('mapa_canvas'), {
    // En el mapa se visualiza el mapa correspondiente a esta latitud, longitud
    center: new google.maps.LatLng(latitud, longitud), //El mapa se visualiza centrado en las coordenadas de latitud y longitud pasadas como argumento
    zoom: 17, //Zoom del mapa
    draggableCursor: 'auto', //El nombre o la URL del cursor que se muestra al desplazar el mouse sobre un mapa arrastrable.
    draggingCursor: 'crosshair', //El nombre o la URL del cursor que se muestra cuando se arrastra el mapa.
    mapTypeId: google.maps.MapTypeId.SATELLITE, //Tipo de mapa.
  })

  añadirEventoClickMapa()
}

//------------------------------------------------------------------------------------------------
//Referencia a un icono. Define sus propiedades.
let icono = {
  url: './images/Marcador_posicion.png', //Imagen del marcador de posición.
  scaledSize: new google.maps.Size(50, 50), //Tamaño escala.
  origin: new google.maps.Point(0, 0), //Origen imgen.
  anchor: new google.maps.Point(25, 50), //Punto de anclaje
}

//--------------------------------------------------------------------------------------------------
//Añade escuchador del evento click sobre el mapa
function añadirEventoClickMapa() {
  google.maps.event.addListener(mapa, 'click', function (event) {
    //Dato que contiene la latitud y longitud del punto donde se ha hecho click.
    let dato_latitud_longitud = event.latLng
    //console.log(dato_latitud_longitud)
    leerDireccion(dato_latitud_longitud)
    mapa.setCenter(dato_latitud_longitud)
    //----------------------------------------------------------------------------------------------
    //Establece el marcador en el mapa.
    marker = new google.maps.Marker({
      position: event.latLng,
      icon: icono,
      map: mapa,
      nombre: 'Localizador',
    })

    //Borra los marcadores que ya estaban en el mapa.
    borrarMarcadores()
    //Añade marcador al array de marcadores.
    marcadores.push(marker)
    //Lectura de la direccion.
    leerDireccion(dato_latitud_longitud)
  })
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
  iLatitud.value = latlng.lat()
  iLongitud.value = latlng.lng()
  let posicionMapa=new google.maps.LatLng(latlng.lat(), latlng.lng())
  iDescripcion.value ="Distancia al origen: " + Math.round(calcularDistancia2Puntos(posicionOrigen,posicionMapa)*100)/100+"m."
  mostrarDireccionDebajoMapa(direccion)
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
function añadirMarcador(registro) {
  borrarMarcadores()
  let marcador = new google.maps.Marker({
    icon: icono,
    position: new google.maps.LatLng(registro.latitud, registro.longitud),
    map: mapa,
  })
  mapa.setCenter(new google.maps.LatLng(registro.latitud, registro.longitud))
  mostrarDireccionDebajoMapa(registro.direccion)
  marcadores.push(marcador)
}

//--------------------------------------------------------------------------------------------------
//Escribe la dirección en la parte inferior del mapa.
function mostrarDireccionDebajoMapa(direccion){
  direccionMapa.innerText=direccion
}

//--------------------------------------------------------------------------------------------------
//Calcular la distancia al punto de origen del mapa.
let posicionOrigen=new google.maps.LatLng(latitud, longitud)

function calcularDistancia2Puntos(posicionInicial, posicionFinal){
  return distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionInicial, posicionFinal)
}

//--------------------------------------------------------------------------------------------------
//Llamada a la función que muestra el mapa.
mostrarMapa() //Muestra el mapa.

//------------------------------------------------------------------------------