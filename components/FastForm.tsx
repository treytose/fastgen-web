import React, { FC, useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  FormControl,
  TextField,
  Typography,
  Button,
  Grid,
  Alert,
} from "@mui/material";

import { useRouter } from "next/router";
import AppContext from "../store/AppContext";

type FastFormProps = {
  entity: string;
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
};

const FastForm: FC<FastFormProps> = ({ entity }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();
  const appCtx = useContext(AppContext);

  useEffect(() => {
    axios
      .get(`/api/${entity}/schema`)
      .then((resp) => {
        console.log(resp);
        let props: Property[] = [];
        Object.keys(resp.data.properties).forEach((key, index) => {
          let value = resp.data.properties[key];
          if (!value.hide_on_form) {
            props.push({
              index,
              name: key,
              title: value.title,
              type: value.type,
              default: value.default,
              value: value.default,
              description: value.description,
              optional: !!value.optional,
            });
          }
        });

        setProperties(props);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: { [key: string]: any } = {};
    properties.forEach((prop) => {
      if (prop.value) {
        body[prop.name] = prop.value;
      }
    });

    setLoading(true);
    axios
      .post(`/api/${entity}`, body)
      .then((resp) => {
        setLoading(false);
        setError("");
        router.push("/config");
      })
      .catch((err: AxiosError) => {
        console.log(err);
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
        <Typography> Loading </Typography>
      ) : (
        <>
          {error && <Alert severity="error"> {error} </Alert>}
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
