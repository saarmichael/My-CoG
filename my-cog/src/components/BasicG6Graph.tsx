import G6 from "@antv/g6";
import Graph from "graphology";
import React, { useEffect } from "react";



const BasicG6Graph = () => { 
    let data = {
        nodes: [
            {
                id: 'node1',
                x: 100,
                y: 200,
            },
            {
                id: 'node2',
                x: 300,
                y: 200,
            },
        ],
        edges: [
            {
                source: 'node1',
                target: 'node2',
            },
        ],
    };

    let graph : any = null;
    useEffect(() => {
        graph = new G6.Graph({
            container: 'mountNode',
            width: 500,
            height: 500,
            defaultNode: {
                size: 15,
                style: {
                    fill: '#DEE9FF',
                    stroke: '#5B8FF9',
                },
            },
            defaultEdge: {
                size: 1,
                color: '#e2e2e2',
            },
            modes: {
                default: ['drag-node'],
            },
        });
        graph.data(data);
        graph.render();
    }, []);

    return (
        <>
            <div id="mountNode"></div>
            <button onClick={() => {
                data = {
                    nodes: [
                        {
                            id: 'node1',
                            x: 300,
                            y: 500,
                        },
                        {
                            id: 'node2',
                            x: 100,
                            y: 100,
                        },
                        {
                            id: 'node3',
                            x: 300,
                            y: 300,
                        },
                    ],
                    edges: [
                        {
                            source: 'node1',
                            target: 'node2',
                        },
                        {
                            source: 'node2',
                            target: 'node3',
                        },
                    ],
                };
                graph.data(data);
                graph.render();
                
            } }>Click me</button>
        </>);
 }

export default BasicG6Graph