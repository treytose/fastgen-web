import React, { useContext, useState } from "react";
import {
  Paper,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import SettingsContext from "../store/SettingsContext";
import { themes } from "../themes/themes";

const ThemeSelection = () => {
  const settingsCtx = useContext(SettingsContext);

  const onThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const themeName = (event.target as HTMLInputElement).value;
    settingsCtx.setTheme(themes[themeName]);
    localStorage.setItem("preferred-theme", themeName);
  };

  return (
    <Paper sx={{ height: "100%" }}>
      <Box sx={{ padding: "2rem" }}>
        Current Theme: {settingsCtx.theme.name}
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Theme</FormLabel>
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
    </Paper>
  );
};

export default ThemeSelection;
