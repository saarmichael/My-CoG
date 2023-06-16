import './GridStyle.css';
import React from "react";

export interface BoxProps {
  name: string;
  content: JSX.Element;
}

export const Box: React.FC<BoxProps> = ({ content }) => {
  return <>{content}</>;
};

export default Box;
