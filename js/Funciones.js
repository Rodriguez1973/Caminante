/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/

//--------------------------------------------------------------------------------------------------
//Muestra ventana emergente de información.
function mostrarVentanaEmergente(mensaje, icono) {
  Swal.fire({
    icon: icono,
    text: mensaje,
    confirmButtonText: 'Aceptar',
  })
}

//-------------------------------------------------------------------------------------------------
//Obtiene la fecha actual.
function obtenerFechaActual() {
  let fecha = new Date() //Fecha actual
  let mes = fecha.getMonth() + 1 //Obtiene el mes
  let dia = fecha.getDate() //Obtiene el día.
  let anio = fecha.getFullYear() //Obtiene el año.
  if (dia < 10) dia = '0' + dia //Agrega cero si es menor de 10
  if (mes < 10) mes = '0' + mes //Agrega cero si es menor de 10
  return dia + '-' + mes + '-' + anio
}

//-------------------------------------------------------------------------------------------------
//Obtiene la fecha actual.
function obtenerHoraActual() {
  let fecha = new Date() //Fecha actual.
  let hora = fecha.getHours() //Obtiene la hora.
  let minutos = fecha.getMinutes() //Obtiene los minutos.
  let segundos = fecha.getSeconds() //Obtiene los segundos.
  if (hora < 10) hora = '0' + hora //Agrega cero si es menor de 10
  if (minutos < 10) minutos = '0' + minutos //Agrega cero si es menor de 10
  if (segundos < 10) segundos = '0' + segundos //Agrega cero si es menor de 10
  return hora + ':' + minutos + ':' + segundos
}

//--------------------------------------------------------------------------------------------------
//Añade la dirección al trayecto.
function añadirDireccion(direccion){
  console.log(direccion)
  opcion=document.createElement('option')
  opcion.innerText=direccion
  sTrazado.appendChild(opcion)
}