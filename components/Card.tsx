import React, { FC } from "react";
import { Paper } from "@mui/material";

const Card: FC<{ children?: React.ReactNode; sx?: Object }> = ({
  children,
  sx,
}) => {
  return <Paper sx={{ ...sx, padding: "3rem" }}>{children}</Paper>;
};

export default Card;
