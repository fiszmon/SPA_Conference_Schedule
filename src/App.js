import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Link, Switch, Route, Redirect} from "react-router-dom";
import {About} from "./Pages/About/About";
import {Home} from "./Pages/Home/Home";
import {Login} from "./Pages/Login/Login";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import {SignForm} from "./Pages/SignForm/SignForm";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "./store/selectors/selectUser";
import Cookie from "js-cookie"
import {loginUserFactory} from "./store/actions/loginUser";
import Typography from "@material-ui/core/Typography";
import LogoSvg from "./Icons/GitApp.svg";
import {logoutUserFactory} from "./store/actions/logoutUser";
import Avatar from "@material-ui/core/Avatar";
import {Reminders} from "./Pages/Reminders/Reminders";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";

export default function App() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        const userCookies = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;
        if (userCookies) {
            dispatch(loginUserFactory(userCookies.id, userCookies.token, userCookies.email));
        }
    }, [dispatch]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (type) => {
        setAnchorEl(null);
    };
    return (
        <Router>
            <div>
                <AppBar position="static">
                    <Toolbar className={"menu_toolbar"}>
                        <img alt="GitApp logo" src={LogoSvg}/>
                        <Typography variant="h6" style={{marginRight: "20px"}}>
                            GitApp
                        </Typography>
                        {
                            !!user.token ?
                                <PrivateNavigation dispatch={dispatch}/>
                                : null
                        }
                    </Toolbar>
                    {
                        !!user.token ?
                            <div className={"menu_btn"}>
                                <Button color="inherit" aria-controls="simple-menu"
                                        aria-haspopup="true"
                                        onClick={handleClick}>
                                    <Icon fontSize="large">
                                        menu
                                    </Icon>
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                >
                                    <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
                                    <MenuItem onClick={handleClose} component={Link} to="/reminders">Reminders</MenuItem>
                                    <MenuItem onClick={handleClose} component={Link} to="/about">About</MenuItem>
                                    <MenuItem onClick={() => {
                                        Cookie.remove("user");
                                        dispatch(logoutUserFactory());
                                        document.location.href = "/";
                                    }}>Logout</MenuItem>
                                </Menu>
                            </div>
                            : null
                    }
                </AppBar>
                <Switch>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/sign-up">
                        <SignForm/>
                    </Route>
                    <PrivateRoute loggedIn={!!user.token} path="/about" component={About}/>
                    <PrivateRoute loggedIn={!!user.token} path="/reminders" component={Reminders}/>
                    <PrivateRoute loggedIn={!!user.token} path="/" component={Home}/>
                </Switch>
            </div>
        </Router>
    );
}

const PrivateRoute = ({loggedIn, ...props}) => {
    return (loggedIn
            ? <Route {...props} />
            : <Redirect to="/login"/>
    )
};

const PrivateNavigation = ({dispatch}) => (
    <>
        <div style={{flexGrow: 1}}>
            <Button
                color="inherit"
                component={Link}
                to={"/"}
            >
                Home
            </Button>
            <Button
                color="inherit"
                component={Link}
                to={"/reminders"}
            >
                Reminders
            </Button>
            < Button
                color="inherit"
                component={Link}
                to={"/about"}
            >
                About
            </Button>
        </div>
        <Avatar style={{backgroundColor: '#daca39', marginRight: '8px'}}/>
        <Button
            color="inherit"
            onClick={() => {
                Cookie.remove("user");
                dispatch(logoutUserFactory());
                document.location.href = "/";
            }}
        >
            Logout
        </Button>
    </>
);