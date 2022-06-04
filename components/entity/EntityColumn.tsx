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
  fkType?: "one2one" | "one2many" | "many2many";
  allowedValues?: string;
  createJoinTable?: boolean;
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
  const typeArgRef = useRef<HTMLInputElement>();
  const [allowedValueToggle, setAllowedValueToggle] = useState<boolean>(false);
  const [fkEnabled, setFkEnabled] = useState<boolean>(false);
  const [fkType, setFkType] = useState<string>("");

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

  const handleAllowedValueToggleUpdate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setAllowedValueToggle(checked);
    onUpdate(index, { ...ecolumn, allowedValues: null });
  };

  const handleAllowedValuesUpdate = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    onUpdate(index, {
      ...ecolumn,
      allowedValues: event.target.value,
    });
  };

  const handleFKToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFkEnabled(event.target.checked);

    if (!event.target.checked) {
      onUpdate(index, {
        ...ecolumn,
        fk: "",
      });
    } else {
      onUpdate(index, {
        ...ecolumn,
        fk: "",
        fkType: "one2many",
      });
    }
  };

  const handleFkUpdate = (event: React.FocusEvent<HTMLInputElement>) => {
    onUpdate(index, {
      ...ecolumn,
      fk: event.target.value,
    });
  };

  const handleFkTypeUpdate = (event: SelectChangeEvent) => {
    setFkType(event.target.value);
    onUpdate(index, {
      ...ecolumn,
      fkType: event.target.value,
    });
  };

  const handleToggleCreateJoin = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate(index, {
      ...ecolumn,
      createJoinTable: event.target.checked,
    });
  };

  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded((e) => !e);
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
    <Accordion
      expanded={expanded}
      sx={{ backgroundColor: "background.default" }}
      onChange={toggleExpanded}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
        <TextField
          placeholder="Enter column name"
          defaultValue={ecolumn.name}
          variant="outlined"
          fullWidth
          onBlur={handleNameUpdate}
          onClick={(e) => e.stopPropagation()}
          sx={{ marginRight: "1rem" }}
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
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox onChange={handleAllowedValueToggleUpdate} />
                  }
                  label="Limit Values"
                />
              </FormGroup>
            </Stack>
          </Grid>
          {allowedValueToggle && (
            <>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ color: "primary.main" }}>
                  ALLOWED VALUES:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="standard"
                  placeholder="Enter SQL or comma separated list of values"
                  fullWidth
                  onBlur={handleAllowedValuesUpdate}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  If using a SELECT statement, ensure the results contain a
                  "name" and "value" column. <br />
                  e.g.
                </Typography>
                <Typography variant="caption" color="secondary">
                  SELECT username as name, userid as value FROM user;
                </Typography>
              </Grid>
            </>
          )}
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              RELATIONS:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Stack direction="row">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox onChange={handleFKToggle} />}
                  label="Foreign Key"
                />
              </FormGroup>
            </Stack>
          </Grid>
          {fkEnabled && (
            <>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ color: "primary.main" }}>
                  Foreign Key:
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="standard"
                  fullWidth
                  placeholder="table.column_name"
                  onBlur={handleFkUpdate}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" fullWidth>
                  <Select
                    defaultValue={"one2many"}
                    onChange={handleFkTypeUpdate}
                  >
                    <MenuItem value="one2many"> One-To-Many</MenuItem>
                    <MenuItem value="one2one"> One-To-One </MenuItem>
                    <MenuItem value="many2many"> Many-To-Many </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {fkType == "many2many" && (
                <Grid item xs={12}>
                  <Stack direction="row">
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox onChange={handleToggleCreateJoin} />}
                        label="Create Join Table"
                      />
                    </FormGroup>
                  </Stack>
                </Grid>
              )}
            </>
          )}
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
