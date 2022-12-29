/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/
let intervaloTiempo=5   //Intervalo de tiempo en segundos para la toma de cada muestra.
let primeraMuestra=true //Flag que indica si es la primera muestra. 
let rutaIniciada = false //Flag que indica si está iniciada la toma de datos de una ruta o no.
let temporizador=null  //Identificador del temporizador.

//-------------------------------------------------------------------------------------------------
//Referencias de los objetos del documento.
const bInicioParo = document.getElementById('bInicioParo')
const iDireccion = document.getElementById('iDireccion')
const mapa_canvas = document.getElementById('mapa_canvas')

//--------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
bInicioParo.addEventListener('click', iniciarPararRuta, false)

//--------------------------------------------------------------------------------------------------
//Inicia o finaliza la toma de datos de una ruta.
function iniciarPararRuta() {
  if (rutaIniciada) {
    rutaIniciada = false
    bInicioParo.style.backgroundImage="url('./images/Iniciar.png')"
    bInicioParo.style.backgroundColor="#24f519"
    bInicioParo.value = 'Iniciar'
    pararCapturaDatos()
    reproducirMensaje("Fin de la toma de datos.")
  } else {
    rutaIniciada = true
    bInicioParo.style.backgroundImage="url('./images/Parar.png')"
    bInicioParo.style.backgroundColor="#fb3737"
    bInicioParo.value = 'Parar'
    reproducirMensaje("Iniciando toma de datos.")
    iniciarCapturaDatos()
  }
}

//--------------------------------------------------------------------------------------------------
//Iniciar toma de datos.
function iniciarCapturaDatos(){
    //Ejecuta la función repetidamente cada intervalo indicado en milisegundos.
    temporizador=setInterval(capturarGeolocalizacion, intervaloTiempo*1000)
}

//--------------------------------------------------------------------------------------------------
//Parar toma de datos.
function pararCapturaDatos(){
    //Finaliza la captura de datos.
    clearInterval(temporizador)   
}