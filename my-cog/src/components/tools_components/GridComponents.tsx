import { ReactNode, useContext } from "react";
import { GraphContainer } from "../../components/data_components/GraphContainer";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import './GridStyle.css';
import { EditablesContainer } from "../../components/data_components/EditablesContainer";
import React from "react";
import TimeSeries from "../data_components/TimeSeries";

export interface BoxProps {
  name: string;
  content: JSX.Element;
}

export const Box: React.FC<BoxProps> = ({ content }) => {
  return <>{content}</>;
};

export default Box;
