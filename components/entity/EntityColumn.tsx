import { FC, useRef, useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Stack,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectChangeEvent } from "@mui/material/Select";

export type DATATYPE = "VARCHAR" | "FLOAT" | "INT" | "DATETIME";

export type EColumn = {
  name: string;
  type: DATATYPE;
  typeArg?: string;
  pk?: boolean;
  fk?: string;
};

type Props = {
  ecolumn: EColumn;
  onUpdate: Function;
  onDelete: Function;
  allowEdit: boolean;
  index: number;
};

const EntityColumn: FC<Props> = ({
  ecolumn,
  onUpdate,
  onDelete,
  allowEdit,
  index,
}) => {
  const nameRef = useRef<HTMLInputElement>();
  const typeArgRef = useRef<HTMLInputElement>();

  const handleNameUpdate = () => {
    const name = !!nameRef.current ? nameRef.current.value : "";
    onUpdate(index, { ...ecolumn, name });
  };

  const handleTypeUpdate = (event: SelectChangeEvent) => {
    const typeArg =
      !!typeArgRef.current && ["VARCHAR", "INT"].includes(event.target.value)
        ? typeArgRef.current.value
        : "";
    onUpdate(index, { ...ecolumn, typeArg: typeArg, type: event.target.value });
  };

  const handleTypArgUpdate = () => {
    const typeArg = !!typeArgRef.current ? typeArgRef.current.value : "";
    onUpdate(index, { ...ecolumn, typeArg: typeArg });
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        {allowEdit ? (
          <TextField
            variant="standard"
            defaultValue={ecolumn.name}
            placeholder="Column name"
            inputRef={nameRef}
            onBlur={handleNameUpdate}
          />
        ) : (
          <Typography> {ecolumn.name} </Typography>
        )}
      </Grid>
      <Grid item xs={4}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={8}>
            {allowEdit ? (
              <FormControl variant="standard" fullWidth>
                <Select
                  defaultValue={!!ecolumn.type ? ecolumn.type : "VARCHAR"}
                  onChange={handleTypeUpdate}
                >
                  <MenuItem value="INT"> INT </MenuItem>
                  <MenuItem value="VARCHAR"> VARCHAR </MenuItem>
                  <MenuItem value="FLOAT"> FLOAT </MenuItem>
                  <MenuItem value="DATETIME"> DATETIME </MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography> {ecolumn.type.toUpperCase()} </Typography>
            )}
          </Grid>
          <Grid xs={4}>
            {["VARCHAR", "INT"].includes(ecolumn.type) && !ecolumn.pk && (
              <Stack direction="row">
                <Typography>(</Typography>
                <TextField
                  InputProps={{
                    inputProps: { style: { textAlign: "center" } },
                  }}
                  inputRef={typeArgRef}
                  variant="standard"
                  defaultValue={"64"}
                  onBlur={handleTypArgUpdate}
                />
                <Typography>)</Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} justifyContent="center" sx={{ textAlign: "center" }}>
        {ecolumn.pk && (
          <Tooltip title="Primary Key" placement="top">
            <KeyIcon color="primary" />
          </Tooltip>
        )}
      </Grid>
      <Grid item xs={2}>
        {allowEdit && (
          <Tooltip title="Delete Column" placement="top">
            <IconButton onClick={(e) => onDelete(index)}>
              <DeleteIcon color="secondary" />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
};

export default EntityColumn;
