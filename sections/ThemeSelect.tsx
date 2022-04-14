import React, { useContext } from "react";
import {
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import SettingsContext from "../store/SettingsContext";
import { themes } from "../themes/themes";

import ColumnCard from "../components/ColumnCard";

const ThemeSelection = () => {
  const settingsCtx = useContext(SettingsContext);

  const onThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const themeName = (event.target as HTMLInputElement).value;
    settingsCtx.setTheme(themes[themeName]);
    localStorage.setItem("preferred-theme", themeName);
  };

  return (
    <ColumnCard title="Theme">
      <Box>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={settingsCtx.theme.name}
            onChange={onThemeChange}
          >
            <FormControlLabel
              value="default"
              control={<Radio />}
              label="Default"
            />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </FormControl>
      </Box>
    </ColumnCard>
  );
};

export default ThemeSelection;
