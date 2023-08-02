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
  app.post('/calcular-arbol', (req, res) => {
    const { nodoInicio, nodoDestino, distancia, tiempo } = req.body;
  
    // Guardar los datos del viaje en la base de datos
    db.query('INSERT INTO Viajes (nodo_inicio_id, nodo_destino_id, distancia, tiempo) VALUES (?, ?, ?, ?)', [nodoInicio, nodoDestino, distancia, tiempo], (err, result) => {
      if (err) throw err;
  
      // Obtener los nodos y las aristas desde la base de datos
      db.query('SELECT * FROM Nodos', (err, nodesResult) => {
        if (err) throw err;
  
        db.query('SELECT * FROM Viajes', (err, edgesResult) => {
          if (err) throw err;
  
          const nodes = nodesResult.map((node) => ({ id: node.id, name: node.nombre }));
          const edges = edgesResult.map((edge) => ({ from: edge.nodo_inicio_id, to: edge.nodo_destino_id, weight: edge.distancia }));
  
          // Calcular el árbol de expansión mínima usando el algoritmo de Prim
          const selectedEdges = primAlgorithm(nodes, edges);
  
          // Devolver los resultados al cliente
          res.json(selectedEdges);
        });
      });
    });
  });
  