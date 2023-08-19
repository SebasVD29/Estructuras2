var viajes;
//var nodos, aristas;
fetch("/datos-viajes")
  .then((response) => response.json())
  .then((data) => {
    viajes = data;
    console.log("Datos ", viajes);
  
    arbol();
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });

function arbol() {
  const nodes = viajes.map((node) => ({ 
    id: node.idViaje, 
    name: node.nodoViajeInicio }));
  const edges = viajes.map((edge) => ({
    from: edge.nodoViajeInicio,
    to: edge.nodoViajeDestino,
    weight: edge.ponderado,
  }));

  console.log("nodos", nodes);
  console.log("Aristas", edges);

  // Calcular el árbol de expansión mínima usando el algoritmo de Prim
  /*const selectedEdges = primAlgorithm(nodes, edges);

  console.log("arbol", selectedEdges);*/
};

/*
function primAlgorithm(nodes, edges) {
  const selectedNodes = new Set();
  const selectedEdges = [];

  selectedNodes.add(nodes[0]);

  while (selectedNodes.size < nodes.length) {
    let minEdge = null;

    for (const edge of edges) {
      if (
        (selectedNodes.has(edge.from) && !selectedNodes.has(edge.to)) ||
        (selectedNodes.has(edge.to) && !selectedNodes.has(edge.from))
      ) {
        if (!minEdge || edge.weight < minEdge.weight) {
          minEdge = edge;
        }
      }
    }

    selectedNodes.add(minEdge.to);
    selectedNodes.add(minEdge.from);
    selectedEdges.push(minEdge);
  }

  return selectedEdges;
}
*/
