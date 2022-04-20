import React, { FC, useRef, useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  FormGroup,
  FormControlLabel,
  Stack,
  Checkbox,
  Accordion,
  Alert,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { grey } from "@mui/material/colors";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyIcon from "@mui/icons-material/Key";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectChangeEvent } from "@mui/material/Select";

export type DATATYPE = "VARCHAR" | "FLOAT" | "INT" | "DATETIME" | "BOOLEAN";

export type EColumn = {
  name: string;
  type: DATATYPE;
  title?: string;
  description?: string;
  defaultValue?: string;
  optional?: boolean;
  hideOnForm?: boolean;
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

  const handleNameUpdate = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.target.value;
    onUpdate(index, { ...ecolumn, name });
  };

  const handleTitleUpdate = (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value;
    onUpdate(index, { ...ecolumn, title });
  };

  const handleDescriptionUpdate = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const description = event.target.value;
    onUpdate(index, { ...ecolumn, description });
  };

  const handleDefaultValueUpdate = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const defaultValue = event.target.value;
    onUpdate(index, { ...ecolumn, defaultValue });
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

  const handleOptionalUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const optional = event.target.checked;
    onUpdate(index, { ...ecolumn, optional });
  };

  const handleHideFormUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    onUpdate(index, { ...ecolumn, hideOnForm: checked });
  };

  return !allowEdit ? (
    <Accordion>
      <AccordionSummary>
        <Grid container>
          <Grid item xs={6}>
            <Typography>{ecolumn.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            {ecolumn.pk && (
              <Tooltip title="Primary Key" placement="top">
                <KeyIcon color="primary" />
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Alert severity="info"> PRIMARY KEY - Cannot Edit</Alert>
      </AccordionDetails>
    </Accordion>
  ) : (
    <Accordion sx={{ backgroundColor: "background.default" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
        <TextField
          placeholder="Enter column name"
          defaultValue={ecolumn.name}
          variant="standard"
          inputRef={nameRef}
          onBlur={handleNameUpdate}
          onClick={(e) => e.stopPropagation()}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "1rem 3rem" }}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              TITLE:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              variant="standard"
              fullWidth
              onBlur={handleTitleUpdate}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              DESCRIPTION:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              variant="standard"
              fullWidth
              onBlur={handleDescriptionUpdate}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              DEFAULT:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              variant="standard"
              fullWidth
              onBlur={handleDefaultValueUpdate}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              TYPE:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl variant="standard" fullWidth>
                  <Select defaultValue={"VARCHAR"} onChange={handleTypeUpdate}>
                    <MenuItem value="INT"> INT </MenuItem>
                    <MenuItem value="VARCHAR"> VARCHAR </MenuItem>
                    <MenuItem value="FLOAT"> FLOAT </MenuItem>
                    <MenuItem value="DATETIME"> DATETIME </MenuItem>
                    <MenuItem value="BOOLEAN"> BOOLEAN </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
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
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              OPTIONS:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Stack direction="row">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox onChange={handleOptionalUpdate} />}
                  label="Optional"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox onChange={handleHideFormUpdate} />}
                  label="Hide on Form"
                />
              </FormGroup>
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Tooltip title="Delete Column" placement="top">
              <IconButton onClick={(e) => onDelete(index)}>
                <DeleteIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default EntityColumn;
