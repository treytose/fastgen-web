import { FC, useState, useEffect, useContext, useCallback } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import AppContext, { FastgenAPI } from "../store/AppContext";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const APISelector: FC<Props> = ({ open, handleClose }) => {
  const appCtx = useContext(AppContext);
  const [apiList, setApiList] = useState<FastgenAPI[]>([]);

  const onApiSelected = (api: FastgenAPI) => {
    appCtx.setAPI(api);
    handleClose();
  };

  const fetchAPIs = useCallback(() => {
    axios.get("/api/fastgen_api").then((resp) => {
      setApiList(resp.data.map((api: FastgenAPI) => api));
    });
  }, []);

  useEffect(() => {
    if (!appCtx.apiConnected) {
      return;
    }
    fetchAPIs();
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogTitle>
        Select API
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!appCtx.apiConnected && (
          <Alert severity="error"> Backend API not running </Alert>
        )}
        <List sx={{ pt: 0, minWidth: "500px" }}>
          {apiList.map((api) => (
            <ListItem button onClick={() => onApiSelected(api)} key={api.name}>
              <ListItemText primary={api.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default APISelector;
