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
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectChangeEvent } from "@mui/material/Select";

export type DATATYPE = "VARCHAR" | "FLOAT" | "INT" | "DATETIME";

export type EColumn = {
  name: string;
  type: DATATYPE;
  optional: boolean;
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
  const [options, setOptions] = useState<string[]>([]);

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

  const handleOptionUpdate = (event: SelectChangeEvent<typeof options>) => {
    const opts =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;

    setOptions(opts);

    let optionArgs = {
      optional: opts.includes("optional"),
    };

    ecolumn.optional = options.includes("optional");
    onUpdate(index, { ...ecolumn, ...optionArgs });
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
              <Stack direction="row" sx={{ marginTop: "7px" }}>
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
      <Grid item xs={3} justifyContent="center" sx={{ textAlign: "center" }}>
        {ecolumn.pk ? (
          <Tooltip title="Primary Key" placement="top">
            <KeyIcon color="primary" />
          </Tooltip>
        ) : (
          <FormControl variant="standard" size="small" fullWidth>
            <Select
              multiple
              displayEmpty
              onChange={handleOptionUpdate}
              value={options}
              renderValue={(selected: string[]) => {
                if (selected.length === 0) {
                  return <em>Options</em>;
                }
                return selected.join(", ");
              }}
            >
              <MenuItem disabled value="">
                <em>Options</em>
              </MenuItem>
              <MenuItem value="optional">
                <Checkbox checked={options.includes("optional")} />
                <ListItemText primary="Optional" />
              </MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid item xs={1}>
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
