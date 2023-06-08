import { useState } from "react";
import TreeItem from "@mui/lab/TreeItem";
import TreeViewMUI from "@mui/lab/TreeView";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
    <TreeViewMUI
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {treeData?.map((node) => (
        <TreeNode node={node} key={node.key} fileClicked={fileClicked} />
      ))}
    </TreeViewMUI>
  );
};

type TreeNodeProps = {
  node: Node;
  fileClicked: (file: string) => void;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, fileClicked }) => {
  const { children, label, isFile } = node;

  const [showChildren, setShowChildren] = useState(false);

  const handleClick = () => {
    if (isFile) {
      fileClicked(node.label);
      return;
    }
    setShowChildren(!showChildren);
  };

  return (
    <TreeItem
      nodeId={node.key}
      label={
        <div onClick={handleClick}>
          {isFile ? (
            <InsertDriveFileIcon sx={{ color: "purple" }} />
          ) : showChildren ? (
            <FolderOpenIcon sx={{ color: "purple" }} />
          ) : (
            <FolderIcon sx={{ color: "purple" }} />
          )}
          <span style={{ paddingLeft: "10px", color: "purple" }}>{label}</span>
        </div>
      }
    >
      {Array.isArray(children) ? children.map((node) => (
        <TreeNode node={node} key={node.key} fileClicked={fileClicked} />
      )) : null}
    </TreeItem>
  );
};

export default TreeView;
