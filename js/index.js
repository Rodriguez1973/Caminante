/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/
let intervaloTiempoMuestra = 2 //Intervalo de tiempo en segundos para la toma de cada muestra.
let intervaloTiempoReloj = 1 //Intervalo de tiempo en segundos para actualizar reloj.
let primeraMuestra = true //Flag que indica si es la primera muestra.
let ultimaMuestra=false //Flag que indica si es la última muestra.
let rutaIniciada = false //Flag que indica si está iniciada la toma de datos de una ruta o no.
let temporizadorMuestra = null //Identificador del temporizador.
let pausado = false //Flag que indica si esta pausada la toma de muestras.
let distanciaMinima=10 //Distancia mínima para que una muestra sea válida.

//-------------------------------------------------------------------------------------------------
//Referencias de los objetos del documento.
const bInicioParo = document.getElementById('bInicioParo')
const iDireccion = document.getElementById('iDireccion')
const sTrazado = document.getElementById('sTrazado')
const mapa_canvas = document.getElementById('mapa_canvas')
const iHoraActual = document.getElementById('iHoraActual')
const iZoom = document.getElementById('iZoom')
const iColor = document.getElementById('iColor')
const iAncho = document.getElementById('iAncho')

//--------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
bInicioParo.addEventListener('click', iniciarPararRuta, false) //Evento click al pulsar el botón bInicioParo.
//Evento change al cambiar el zoom.
iZoom.addEventListener('change', () => {
  mapa.setZoom(parseInt(iZoom.value))
}, false)


//--------------------------------------------------------------------------------------------------
//Crea los eventos change al finalizar la toma de muestras.
function crearEventos(){
//Evento change al cambiar el color del trazo.
iColor.addEventListener('change', actualizarTrazado,false)
//Evento change al cambiar el ancho del trazo.
iAncho.addEventListener('change', actualizarTrazado, false)
}

//--------------------------------------------------------------------------------------------------
//Actualiza el las propiedades del trazado.
function actualizarTrazado(){
  if(ruta){
    borrarTrazado()
    trazarLinea()
  }
}

//--------------------------------------------------------------------------------------------------
//Elimina los eventos change durante la toma de muestras.
function destruirEventos(){
  iColor.removeEventListener('change', actualizarTrazado, false)
  iColor.removeEventListener('change', actualizarTrazado, false)
}

//--------------------------------------------------------------------------------------------------
//Inicia o finaliza la toma de datos de una ruta.
function iniciarPararRuta() {
  if (rutaIniciada) {
    
    rutaIniciada = false
    bInicioParo.style.backgroundImage = "url('./images/Iniciar.png')"
    bInicioParo.style.backgroundColor = '#24f519'
    bInicioParo.value = 'Iniciar'
    pararCapturaDatos()
    crearEventos()
    primeraMuestra = true;
    reproducirMensaje('Fin de la toma de datos.')
  } else {
    sTrazado.innerHTML = "";
    borrarMarcadores()
    borrarTrazado()
    destruirEventos()
    rutaIniciada = true
    bInicioParo.style.backgroundImage = "url('./images/Parar.png')"
    bInicioParo.style.backgroundColor = '#fb3737'
    iDireccion.value = ""
    bInicioParo.value = 'Parar'
    iniciarCapturaDatos()
  }
}

//--------------------------------------------------------------------------------------------------
//Iniciar toma de datos.
function iniciarCapturaDatos() {
  reproducirMensaje('Iniciando toma de datos.')
  //Ejecuta la función repetidamente cada intervalo indicado en milisegundos.
  temporizadorMuestra = setInterval(() => {
    if (!pausado) {
      capturarGeolocalizacion()
    }
  }, intervaloTiempoMuestra * 1000)
}

//--------------------------------------------------------------------------------------------------
//Parar toma de datos.
function pararCapturaDatos() {
  //Sustituye el ícono del último marcador.
  marcadores[marcadores.length - 1].icon = iconoFin
  //Finaliza la captura de datos.
  clearInterval(temporizadorMuestra)
}

//--------------------------------------------------------------------------------------------------
//Actualizar el reloj.
function actualizarHora() {
  temporizadorHora = setInterval(() => {
    iHoraActual.value = obtenerHoraActual() + "   " + obtenerFechaActual();
  }, intervaloTiempoReloj * 1000)
}

actualizarHora()  //Actualiza la hora.