import { useEffect } from "react";
import Graph from "graphology";
import { ControlsContainer, FullScreenControl, SigmaContainer, useLoadGraph, ZoomControl } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode("first", { x: 0, y: 0, size: 15, label: "My first node", color: "#FA4F40" });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const BasicNetGraph = () => {
  return (
    <SigmaContainer style={{ height: "200px", width: "200px" }}>
      <LoadGraph />
      <ControlsContainer>
        <FullScreenControl />
        <ZoomControl />
      </ControlsContainer>
    </SigmaContainer>
  );
};
export default BasicNetGraph