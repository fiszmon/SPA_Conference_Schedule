import React, {Fragment, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {OutlinedInput, Paper} from "@material-ui/core";
import styles from "./SignForm.module.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useForm} from "react-hook-form";
import {RHFInput} from 'react-hook-form-input';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import * as axios from "axios";
import Alert from "@material-ui/lab/Alert";
import {Redirect} from "react-router-dom";
import Divider from "@material-ui/core/Divider";

export const SignForm = () => {
    const {register, handleSubmit, setValue, errors, watch} = useForm(); // todo ->  useForm({mode: "onChange"})
    const [error, setError] = useState(null);
    const [created, setCreated] = useState(false);

    async function onSubmit(data) {
        try {
            const response = await axios.post("https://ie2020.kisim.eu.org/api/users", {
                email: data.email,
                password: data.password
            });
            if (response.status > 204) {
                throw response;
            } else {
                console.log(response.data);
                setCreated(true);
            }
        } catch (e) {
            if (e.response.status === 409) {
                setError(e.response.data.message)
            } else {
                setError(e.response.statusText);
            }
        }
    };

    if (created)
        return (<Redirect to="/login"/>);

    return (
        <Fragment>
            <Paper elevation={4} className={styles.container}>
                <Typography variant={"h4"}>Sign up to app</Typography>
                <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} justify="flex-start">
                        <Grid item xs={12}>
                            <RHFInput
                                as={
                                    <FormControl variant="outlined" fullWidth error={!!errors.email}>
                                        <InputLabel>Email Address</InputLabel>
                                        <OutlinedInput name='email' autoComplete="email" label="Email Address"/>
                                        {errors.email?.type === "required" && <FormHelperText>Required</FormHelperText>}
                                        {errors.email?.type === "pattern" &&
                                        <FormHelperText>Incorrect email</FormHelperText>}
                                    </FormControl>
                                }
                                name='email'
                                register={register({
                                    required: true,
                                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                                })}
                                setValue={setValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <RHFInput
                                as={
                                    <FormControl variant="outlined" fullWidth error={!!errors.password}>
                                        <InputLabel>Your password</InputLabel>
                                        <OutlinedInput label="Your password" type='password'/>
                                        {errors.password?.type === "required" &&
                                        <FormHelperText>Required</FormHelperText>}
                                        {errors.password?.type === "pattern" &&
                                        <FormHelperText>Weak password</FormHelperText>}
                                    </FormControl>
                                }
                                name='password'
                                register={register({
                                    required: true,
                                    pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
                                })}
                                setValue={setValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <RHFInput
                                as={
                                    <FormControl variant="outlined" fullWidth error={!!errors.repeatedPassword}>
                                        <InputLabel>Repeat your password</InputLabel>
                                        <OutlinedInput label="Repeat your password" type='password'/>
                                        {errors.repeatedPassword?.type === "required" &&
                                        <FormHelperText>Required</FormHelperText>}
                                        {errors.repeatedPassword?.type === "validate" &&
                                        <FormHelperText>Passwords are no't equals</FormHelperText>}
                                    </FormControl>
                                }
                                name='repeatedPassword'
                                register={register({required: true, validate: value => value === watch('password')})}
                                setValue={setValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {!error ? null : <Alert severity="error">{error}</Alert>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                className={styles.button}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Divider/>
                <Typography variant={"body1"}>You already have an account?</Typography>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color={"primary"}
                        href="/login"
                        className={styles.button}>
                        Login
                    </Button>
                </Grid>
            </Paper>
        </Fragment>
    )
};