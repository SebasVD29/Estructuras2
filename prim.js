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
  n = 0;
  const nodes = viajes.map((node) => ({
    id: node.idViaje,
    name: node.nodoViajeInicio,
  }));
  const edges = viajes.map((edge) => ({
    id: edge.idViaje,
    from: edge.nodoViajeInicio,
    to: edge.nodoViajeDestino,
    weight: edge.ponderado,
  }));

  /*
  // Calcular el árbol de expansión mínima usando el algoritmo de Prim
  const selectedEdges = primAlgorithm(nodes, edges);
  console.log("arbol", selectedEdges);*/

  const tree = primAlgorithm(edges);
  console.log("Nodes:", [...tree.nodes]);
  console.log("Edges:", tree.edges);
}

function primAlgorithm(edges) {
  const nodes = new Set();
  edges.forEach((edge) => {
    nodes.add(edge.from);
    nodes.add(edge.to);
  });

  const startingNode = edges[0].from;

  const tree = {
    nodes: new Set([startingNode]),
    edges: [],
  };

  while (tree.nodes.size < nodes.size) {
    let minEdge = null;  
    let minWeight = Infinity;

    for (const edge of edges) {
      if (
        (tree.nodes.has(edge.from) && !tree.nodes.has(edge.to)) ||
        (tree.nodes.has(edge.to) && !tree.nodes.has(edge.from))
      ) {
        if (edge.weight < minWeight) {
          minEdge = edge;
          minWeight = edge.weight;
        }
      }
    }

    if (minEdge) {
      tree.edges.push(minEdge);
      tree.nodes.add(minEdge.from);
      tree.nodes.add(minEdge.to);
    }
  }

  return tree;
}


