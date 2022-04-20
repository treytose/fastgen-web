import { useEffect, useCallback, useContext, useState } from "react";
import axios from "axios";
import {
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import AppContext from "../store/AppContext";

import ColumnCard from "../components/ColumnCard";

const Config = () => {
    const router = useRouter();
    const appCtx = useContext(AppContext);
    const [apiList, setApiList] = useState<string[]>([]);

    const onApiSelected = (apiName: string) => {
        appCtx.setApiName(apiName);
    };

    const fetchAPIs = useCallback(() => {
        axios.get("/api/fastgen_api").then((resp) => {
            setApiList(resp.data.map((api: { name: string }) => api.name));
        });
    }, []);

    useEffect(() => {
        if (!appCtx.apiConnected) {
            router.push("/");
            return;
        }
        fetchAPIs();
    }, []);

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <ColumnCard title="Select an API to Configure">
                        <List>
                            {apiList.map((api) => (
                                <ListItem key={api}>
                                    <ListItemButton
                                        selected={appCtx.apiName === api}
                                        onClick={(e) => onApiSelected(api)}
                                    >
                                        <ListItemText primary={api} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        {apiList.length === 0 && (
                            <h5> You have not created any APIs yet. </h5>
                        )}
                    </ColumnCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Config;
