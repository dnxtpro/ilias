function llamarApiMarcador() {
    // Realizar la solicitud AJAX
    $.ajax({
        url: 'http://localhost:4001/api/marcador',
        method: 'GET',
        success: function(data) {
            // Recorrer los datos de la respuesta
            var contenedorDatos = $("#contenedor-datos");
            contenedorDatos.html(""); // Limpiar el contenido previo
            for (var variable in data) {
              if (data.hasOwnProperty(variable)) {
                var valor = data[variable];
                // Crear elementos HTML para mostrar la variable y su valor
                var elemento = $("<p>");
                elemento.html("<b>" + variable + ":</b> " + valor);
                contenedorDatos.append(elemento);
              }
            }
          },
        error: function(xhr, status, error) {
            // Manejar errores
            console.error('Error al llamar a la API:', error);
        }
    });
    
}

// Llamar a la función inicialmente y luego cada 5 segundos
llamarApiMarcador(); // Llamada inicial
setInterval(llamarApiMarcador, 5000); // Llamada cada 5 segundos
