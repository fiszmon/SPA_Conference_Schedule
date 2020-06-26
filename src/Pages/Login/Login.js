import React, {Fragment, useState} from "react";
import {Paper} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import TextField from "@material-ui/core/TextField";
import styles from "./Login.module.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {loginUserFactory} from "../../store/actions/loginUser";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import {selectUser} from "../../store/selectors/selectUser";
import {Redirect} from "react-router-dom";
import Cookie from "js-cookie";

export function Login() {
    return (
        <Fragment>
            <Paper elevation={4} className={styles.container}>
                <Typography variant={"h4"}>Login to app</Typography>
                <LoginComponent/>
                <Divider/>
                <Typography variant={"body1"}>Don't have an account?</Typography>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color={"primary"}
                        href="/sign-up"
                        className={styles.button}>
                        Sign up
                    </Button>
                </Grid>
            </Paper>
        </Fragment>
    )
}

const LoginComponent = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailChanged, setEmailChanged] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector(selectUser);

    const isEmailValid = validateEmail(email);
    const allValid = isAllValid(isEmailValid, password);
    const displayError = (emailChanged && !isEmailValid);

    function onSubmit() {
        if (!allValid)
            return;
        axios.post("https://ie2020.kisim.eu.org/api/auth", {}, {
            auth: {
                username: email,
                password
            },
        }).then((response) => {
            if (response.status !== 201) {
                throw response;
            } else {
                setError(null);
                console.log("logged in");
                const user = response.data.user;
                Cookie.set("user", {
                    id: user.id, token: response.data.token, email: user.email
                });
                dispatch(loginUserFactory(user.id, response.data.token, user.email));
            }
        }).catch((e) => {
            if (e.response.status === 401) {
                setError("Wrong username or password")
            } else {
                setError(e.statusText);
            }
        });
    }

    if (user.token) {
        return (<Redirect to="/"/>);
    }

    return (
        <Fragment>
            <TextField
                label="Your email"
                value={email}
                onChange={(el) => {
                    setEmail(el.target.value);
                }}
                onBlur={() => {
                    setEmailChanged(true);
                }}
                variant="outlined"
                name="email"
                autoComplete="email"
                error={displayError}
                helperText={displayError ? "Incorrect email" : ""}
            />
            <TextField
                label="Your password"
                type={"password"}
                value={password}
                onChange={(el) => {
                    setPassword(el.target.value)
                }}
                variant="outlined"
            />
            {!error ? null : <Alert severity="error">{error}</Alert>}
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!allValid}
                    onClick={onSubmit}
                    className={styles.button}>
                    Submit
                </Button>
            </Grid>
        </Fragment>
    );
}

const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

function validateEmail(email) {
    return EMAIL_RE.test(email);
}

function isAllValid(isEmailValid, password) {
    return (isEmailValid && password.length >= 8);
}
