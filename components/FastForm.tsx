import React, { FC, useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  FormControl,
  TextField,
  Box,
  Button,
  Grid,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "next/router";
import AppContext from "../store/AppContext";

type FastFormProps = {
  entity: string;
  axiosOptions?: object;
};

type Property = {
  index: number;
  name: string;
  title: string;
  type: string;
  value?: string;
  default?: string;
  description?: string;
  optional?: boolean;
  allowed_values: string[] | number[];
};

const FastForm: FC<FastFormProps> = ({ entity, axiosOptions = {} }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();
  const appCtx = useContext(AppContext);

  useEffect(() => {
    axios
      .get(`/api/${entity}/schema`)
      .then((resp) => {
        let props: Property[] = [];
        Object.keys(resp.data.properties).forEach((key, index) => {
          let value = resp.data.properties[key];
          if (!value.hide_on_form) {
            props.push({
              index,
              name: key,
              value: value.default
                ? value.default
                : !!value.allowed_values && value.allowed_values.length > 0
                ? value.allowed_values[0]
                : null,
              ...value,
            });
          }
        });

        setProperties(props);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let body: { [key: string]: any } = {};
    properties.forEach((prop) => {
      if (prop.value) {
        body[prop.name] = prop.value;
      }
    });

    setLoading(true);
    axios
      .post(`/api/${entity}`, body, axiosOptions)
      .then((resp) => {
        setLoading(false);
        setError("");
        router.push("/config");
      })
      .catch((err: AxiosError) => {
        console.error(err);
        setLoading(false);
        setError(err.message);
      });
  };

  const handlePropertyUpdate = (index: number, value: any) => {
    setProperties((properties) => {
      properties[index].value = value;
      return [...properties];
    });
  };

  const RenderProperty = (property: Property) => {
    if (property.allowed_values && property.allowed_values.length > 0) {
      return (
        <FormControl variant="standard" fullWidth>
          <InputLabel>{property.title}</InputLabel>
          <Select
            label={property.title}
            value={property.value}
            onChange={(e) => {
              handlePropertyUpdate(property.index, e.target.value);
            }}
          >
            {property.allowed_values.map((v, i) => (
              <MenuItem value={v} key={i}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    switch (property.type) {
      case "string":
        return (
          <TextField
            variant="standard"
            label={property.title}
            name={property.name}
            value={property.value || ""}
            fullWidth
            required={!property.optional}
            onChange={(e) =>
              handlePropertyUpdate(property.index, e.target.value)
            }
          />
        );
    }
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && (
            <Alert sx={{ marginBottom: "1rem" }} severity="error">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Grid container spacing={2}>
                {properties.map((p) => (
                  <Grid item xs={6} key={p.name}>
                    {RenderProperty(p)}
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained">
                    Create
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          </form>
        </>
      )}
    </>
  );
};

export default FastForm;
