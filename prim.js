var viajes;

fetch('/datos-viajes')
.then((response) => response.json())
.then((data) => {
  viajes = data;
  console.log('Viajes', viajes);

})
.catch((error) => {
  console.error('Error al obtener los datos:', error);
})

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
}*/



/*
const nodes = viajesResult.map((node) => ({
  id: node.id,
  name: node.nombre,
}));
const edges = viajesResult.map((edge) => ({
  from: edge.nodo_inicio_id,
  to: edge.nodo_destino_id,
  weight: edge.distancia,
}));

// Calcular el árbol de expansión mínima usando el algoritmo de Prim
const selectedEdges = primAlgorithm(nodes, edges);*/