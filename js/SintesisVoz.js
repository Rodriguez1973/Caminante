/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/
//Inicialización.
//Idioma seleccionado.
const idiomaSeleccionado = 'es-ES'

//Representa una solicitud de voz. Contiene el contenido que debe leer el servicio de voz e información sobre cómo leerlo (por ejemplo, idioma, tono y volumen).
const reproduccionVoz = new SpeechSynthesisUtterance()
reproduccionVoz.lang = idiomaSeleccionado //Establece el idioma de reproducción.
reproduccionVoz.volume = 1 //Establece el volumen al máximo.
reproduccionVoz.rate = 1 //Velocidad de habla.
reproduccionVoz.pitch = 1 //Tono de reproducción.

//--------------------------------------------------------------------------------------------------
//Reproduce el mensaje.
function reproducirMensaje(mensaje) {
  reproduccionVoz.text = mensaje
  window.speechSynthesis.speak(reproduccionVoz)
}
