/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/
let intervaloTiempoMuestra = 5 //Intervalo de tiempo en segundos para la toma de cada muestra.
let intervaloTiempoReloj = 1 //Intervalo de tiempo en segundos para actualizar reloj.
let primeraMuestra = true //Flag que indica si es la primera muestra.
let rutaIniciada = false //Flag que indica si está iniciada la toma de datos de una ruta o no.
let temporizadorMuestra = null //Identificador del temporizador.

//-------------------------------------------------------------------------------------------------
//Referencias de los objetos del documento.
const bInicioParo = document.getElementById('bInicioParo')
const iDireccion = document.getElementById('iDireccion')
const sTrazado = document. getElementById('sTrazado')
const mapa_canvas = document.getElementById('mapa_canvas')
const iHoraActual = document.getElementById('iHoraActual')
const iZoom = document.getElementById('iZoom')
const iColor = document.getElementById('iColor')
const iAncho = document.getElementById('iAncho')

//--------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
bInicioParo.addEventListener('click', iniciarPararRuta, false)
iZoom.addEventListener('change', () => {
  mapa.setZoom(parseInt(iZoom.value))
})

//--------------------------------------------------------------------------------------------------
//Inicia o finaliza la toma de datos de una ruta.
function iniciarPararRuta() {
  if (rutaIniciada) {
    rutaIniciada = false
    bInicioParo.style.backgroundImage = "url('./images/Iniciar.png')"
    bInicioParo.style.backgroundColor = '#24f519'
    bInicioParo.value = 'Iniciar'
    pararCapturaDatos()
    primeraMuestra=true;
    reproducirMensaje('Fin de la toma de datos.')
  } else {
    marcadores = []
    rutaIniciada = true
    bInicioParo.style.backgroundImage = "url('./images/Parar.png')"
    bInicioParo.style.backgroundColor = '#fb3737'
    bInicioParo.value = 'Parar'
    iniciarCapturaDatos()
  }
}

//--------------------------------------------------------------------------------------------------
//Iniciar toma de datos.
function iniciarCapturaDatos() {
  //Ejecuta la función repetidamente cada intervalo indicado en milisegundos.
  temporizadorMuestra = setInterval(
    capturarGeolocalizacion,
    intervaloTiempoMuestra * 1000,
  )
}

//--------------------------------------------------------------------------------------------------
//Parar toma de datos.
function pararCapturaDatos() {
  marcadores[marcadores.length].icono =
    //Finaliza la captura de datos.
    clearInterval(temporizadorMuestra)
}

//--------------------------------------------------------------------------------------------------
//Actualizar el reloj.
function actualizarHora() {
  temporizadorHora = setInterval(() => {
    iHoraActual.value = obtenerHoraActual()+"   "+obtenerFechaActual();
  }, intervaloTiempoReloj * 1000)
}

actualizarHora()  //Actualiza la hora.