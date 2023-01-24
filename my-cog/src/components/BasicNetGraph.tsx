import React, { useEffect, useState } from 'react';
import { DirectedGraph, UndirectedGraph } from 'graphology'
import { Sigma } from 'sigma'


const createGraph = () => {
    const graph = new UndirectedGraph()
    graph.addNode("John", { x: 15, y: 10, size: 5, label: "John", color: "blue" });
    graph.addNode("Mary", { x: 10, y: 0, size: 3, label: "Mary", color: "red" });
    graph.addNode("Bob", { x: 0, y: 0, size: 2, label: "Bob", color: "green" });
    graph.addNode("Alice", { x: 0, y: 10, size: 7, label: "Alice", color: "yellow" });
    graph.addNode("Mark", { x: 5, y: 5, size: 5, label: "Mark", color: "purple" });
    graph.addNode("Kate", { x: 5, y: 5, size: 4, label: "Kate", color: "orange" });


    graph.addEdge("John", "Mary");
    graph.addEdge("John", "Bob");
    graph.addEdge("John", "Alice");
    graph.addEdge("John", "Mark");
    graph.addEdge("Alice", "Bob");
    graph.addEdge("Alice", "Kate");
    graph.addEdge("Bob", "Kate");


    return graph
}

const BasicNetGraph = () => {
    const [graph, setGraph] = useState<UndirectedGraph>()
    // reference to graph-container div
    let graphContainer = React.createRef<HTMLDivElement>()
    useEffect(() => {
        const graph = createGraph()
        setGraph(graph)
    }, [])

    useEffect(() => {
        if (graph) {
            const s = new Sigma(graph, graphContainer.current!)
        }
    }, [graph])

    return (
        <div id="graph-container" ref={graphContainer} style={{ width: '100%', height: "400px" }}></div>
    )
}

export default BasicNetGraph