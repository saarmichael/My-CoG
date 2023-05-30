import { useState } from "react";



export type Node = {
    key: string;
    label: string;
    children: Node[];
    isFile: boolean;
};

type TreeViewProps = {
    treeData: Node[];
    fileClicked: (file: string) => void;
};

const TreeView: React.FC<TreeViewProps> = ({ treeData, fileClicked }) => {
    return (
      <ul>
        {treeData?.map((node) => (
          <TreeNode node={node} key={node.key} fileClicked={fileClicked} />
        ))}
      </ul>
    );
  }

type TreeNodeProps = {
    node: Node;
    key: string;
    fileClicked: (file: string) => void;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, fileClicked }) => {
    const { children, label } = node;
  
    const [showChildren, setShowChildren] = useState(false);
  
    const handleClick = () => {
      if (node.isFile) {
        fileClicked(node.label);
        return;
      }
      setShowChildren(!showChildren);
    };
    return (
      <>
        <div onClick={handleClick} style={{ marginBottom: "10px" }}>
          <span>{label}</span>
        </div>
        <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" }}>
          {showChildren && <TreeView treeData={children} fileClicked={fileClicked}/>}
        </ul>
      </>
    );
  };

  export default TreeView;