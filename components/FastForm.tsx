import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import {
  FormControl,
  TextField,
  Typography,
  Button,
  Grid,
} from "@mui/material";

type FastFormProps = {
  entity: string;
};

type Property = {
  name: string;
  title: string;
  type: string;
};

const FastForm: FC<FastFormProps> = ({ entity }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/schema`)
      .then((resp) => {
        let props: Property[] = [];
        Object.keys(resp.data.properties).forEach((key) => {
          let value = resp.data.properties[key];
          props.push({
            name: key,
            title: value.title,
            type: value.type,
          });
        });

        setProperties(props);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const RenderProperty = (property: Property) => {
    switch (property.type) {
      case "string":
        return (
          <TextField
            key={property.name}
            variant="standard"
            label={property.title}
            fullWidth
          />
        );
    }
  };

  return (
    <>
      {loading ? (
        <Typography> Loading </Typography>
      ) : (
        <FormControl>
          <Grid container spacing={2}>
            {properties.map((p) => (
              <Grid item xs={6}>
                {RenderProperty(p)}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button fullWidth variant="contained">
                Create
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      )}
    </>
  );
};

export default FastForm;
