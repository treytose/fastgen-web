import { FC, useEffect } from "react";
import { TreeItem, TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type Tree = {
  id?: string;
  name: string;
  children?: Tree[];
  description?: string;
};

const FileTree: FC<{ tree: Tree[]; expandAll: boolean }> = ({
  tree,
  expandAll = true,
}) => {
  let idList: string[] = [];
  // Generate the unique IDs for each tree node
  tree.forEach((t, i) => {
    t.id = i.toString();
    idList.push(t.id);
    if (!!t.children) {
      t.children.forEach((c, j) => {
        c.id = `${i}_${j}`;
        idList.push(c.id);
      });
    }
  });
  console.log(tree);
  console.log(idList);

  return (
    <TreeView
      defaultExpanded={expandAll ? idList : []}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultCollapseIcon={<ExpandMoreIcon />}
    >
      {tree.map((t) => (
        <TreeItem key={t.id} nodeId={t.id || ""} label={t.name}></TreeItem>
      ))}
    </TreeView>
  );
};

export default FileTree;
