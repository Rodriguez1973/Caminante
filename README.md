# Camino del caminante.

navigator.geolocation.getCurrentPosition(pos => {
    //alert(pos.coords.latitude+","+ pos.coords.latitude);
    latitud = pos.coords.latitude;
    longitud = pos.coords.longitude;
    inicio();
})<br>

Crear una aplicación web que según vayamos caminando dibuje (cada intervalo prefijado) un icono con la  latitud y longitud obtenidas, un trazado entre los puntos del mapa obtenidos y las direcciones de esos puntos.<br>	
Crear un diseño responsive para que se vea bien en el móvil.<br>
Colgar la aplicación en masbaratoimposible.com y ejecutar la página desde el móvil.<br>