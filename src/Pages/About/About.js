import React, {Fragment} from "react";
import Grid from "@material-ui/core/Grid";
import style from "./About.module.css";
import Typography from "@material-ui/core/Typography";
import Svg from '../../Icons/GitApp.svg';

export function About() {
    return (
        <Fragment>
            <Grid
                container
                spacing={1}
                justify='center'
                align='center'
            >
                <Grid item xs={12} sm={6}>
                    <img alt="GitApp logo" className={style.svg} src={Svg}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid
                        container>
                        <Grid item xs={12}>
                            <Typography className={style.paper} variant="h6">
                                GitApp production
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={style.paper} variant="body1">
                                The reason for creating the application is one of
                                the subjects of the study - "Internet engineering"
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    );
}
