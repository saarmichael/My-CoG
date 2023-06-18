import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TreeItem from "@mui/lab/TreeItem";
import TreeViewMUI from "@mui/lab/TreeView";
import { useState } from "react";

export type Node = {
  key: string;
  label: string;
  children: Node[];
  isFile: boolean;
};

type TreeViewProps = {
  treeData: Node[];
  fileClicked?: (file: string) => void;
  folderClicked?: (folder: string) => void;
};

const TreeView: React.FC<TreeViewProps> = ({ treeData, fileClicked, folderClicked }) => {
  return (
    <TreeViewMUI
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {treeData?.map((node) => (
        <TreeNode node={node} key={node.key} fileClicked={fileClicked} folderClicked={folderClicked}/>
      ))}
    </TreeViewMUI>
  );
};

type TreeNodeProps = {
  node: Node;
  fileClicked?: (file: string) => void;
  folderClicked?: (folder: string) => void;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, fileClicked, folderClicked }) => {
  const { children, label, isFile } = node;

  const [showChildren, setShowChildren] = useState(false);

  const handleClick = () => {
    if (isFile) {
      if (fileClicked) {
        fileClicked(node.label);
      }
      return;
    }
    setShowChildren(!showChildren);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!isFile) {
      if (folderClicked) {
        folderClicked(node.label);
      }
      return;
    }
  };

  return (
    <TreeItem
      nodeId={node.key}
      label={
        <div onClick={handleClick} onContextMenu={handleMouseDown}>
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
        <TreeNode node={node} key={node.key} fileClicked={fileClicked} folderClicked={folderClicked}/>
      )) : null}
    </TreeItem>
  );
};

export default TreeView;
