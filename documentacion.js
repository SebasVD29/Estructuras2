/*
--document.getElementById: se selecciona un elemento por medio del valor del atributo id que se le haya asignado
--let: declara una variable de alcance local con ámbito de bloque
lo que significa que solo están disponibles dentro del bloque en el que se declaran. 
En cambio, las variables declaradas con var tienen un alcance de función o global, 
lo que podría llevar a problemas de colisión de nombres o comportamiento inesperado.

-Number. MAX_VALUE devuelve el número más grande posible de JavaScript.

--una iteración es objeto que permite recorrer una colección y devolver un valor al terminar

--fetch:proporciona una interfaz JS para acceder y manipular partes del canal HTTP, tales como peticiones y respuestas.

--Json: transferencia de datos entre un servidor web y aplicación web

--catch: instrucción que especifica una respuesta si se produce una excepción

--Autocomplete: es una función de la biblioteca de Places de la API de Maps JavaScript. se puede usar esta función para incluir
 en las aplicaciones el comportamiento de escritura anticipada del campo de búsqueda de Google Maps.

--La función BusquedaDeLugar se encarga de configurar las funcionalidades de autocompletado de lugares en los campos de entrada. 
Para cada campo de entrada, se crea una instancia de google.maps.places.Autocomplete.
Dentro de cada evento place_changed, se captura el lugar seleccionado y se comprueba si tiene geometría (ubicación válida). 
Luego, se centra el mapa en esa ubicación y crea un marcador en esa posición. 
Las coordenadas de esa posición se almacenan en las variables position1, position2, etc., según el campo de entrada.

--La función arbol se creo para generar información del grafo, para representar visualmente el tipo estructura o conexión entre nodos 
de los viajes, estos valores se utilizan para construir un objeto que representa una arista en el grafo.
El resultado final es un arreglo de objetos edges, donde cada objeto representa una arista en el grafo. Cada objeto contiene 
información sobre los nodos de inicio y destino, así como el ponderado asociado con esa arista.

--La función obtenerLatLog toma un argumento place, que se espera que sea un objeto que represente un lugar o una ubicación.
Dentro de la función, se realiza una verificación para asegurarse de que el objeto place contenga información de geometría (geometry) y ubicación (location). 
Si cualquiera de estas propiedades está ausente, la función sale temprano usando return.
Si el objeto place tiene información de geometría y ubicación, se extraen las coordenadas de latitud (lat) y longitud (lng) de 
la propiedad location. Estas coordenadas se almacenan en el objeto positionInicio.Luego, se imprime en la consola las coordenadas almacenadas en positionInicio.
Finalmente, la función devuelve el objeto positionInicio que contiene las coordenadas de latitud y longitud.

-- la función encontrarVerticeCercano busca el vértice no visitado más cercano basado en las distancias almacenadas en el objeto 
distancias. La función retorna el identificador del vértice más cercano.

--

--
*/