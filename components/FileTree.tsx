import { FC, useState } from "react";
import { Popover, Typography, Box } from "@mui/material";
import { TreeItem, TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type Tree = {
  id?: string;
  name: string;
  children?: Tree[];
  description?: string;
};

const generateId = (tree: Tree) => {
  tree.id = tree.name;
  if (tree.children) {
    tree.children.forEach((child) => {
      generateId(child);
    });
  }
};

const FileTree: FC<{ tree: Tree; expanded?: string[] }> = ({
  tree,
  expanded = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  generateId(tree);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    description?: string
  ) => {
    setAnchorEl(!!description ? event.currentTarget : null);
    setDescription(description || null);
    console.log("mouse over");
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const RenderTree = (tree: Tree) => (
    <TreeItem
      nodeId={tree.id || ""}
      label={tree.name}
      aria-haspopup="true"
      onMouseEnter={(e) => handlePopoverOpen(e, tree.description)}
      onMouseLeave={handlePopoverClose}
      key={tree.id}
    >
      {Array.isArray(tree.children)
        ? tree.children.map((node) => RenderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}> {description} </Typography>
      </Popover>
      <TreeView
        defaultExpanded={expanded || []}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultCollapseIcon={<ExpandMoreIcon />}
        sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {RenderTree(tree)}
      </TreeView>
    </>
  );
};

export default FileTree;
