import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import React from "react";
import Typography from "@material-ui/core/Typography";
import styles from "./Presentation.module.css"
import IconButton from "@material-ui/core/IconButton";
import {Tooltip} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import * as axios from "axios";
import {addReminderFactory, deleteReminderFactory} from "../../../store/actions/toggleReminder";
import {selectToken} from "../../../store/selectors/selectToken";

export const Presentation = ({id, day, time, session, title, author, color, file, reminder}) => {
    return(
        <Paper elevation={3} className={styles.container} style={{'--primary': color}}>
            <TimeContainer day={day} time={time}>
                <Session name={session}/>
            </TimeContainer>
            <PresentationTitle title={title}/>
            <PresentationAuthors author={author}/>
            <PresentationFooter file={file} reminder={reminder} presentationId={id}/>
        </Paper>
    );
}

const TimeContainer = ({day, time, children}) => {
    return (
        <div className={styles.timeContainer}>
            {day?
                (<Typography variant="body2" style={{paddingRight: "10px",paddingTop: "2px", alignItems: "center"}}>
                    {day.slice(0,3)}
                </Typography>)
                :
                null
            }
            <Typography variant="button" gutterBottom className={styles.iconAndText}>
                <Icon fontSize="small">
                    schedule
                </Icon>
                <time>{time}</time>
            </Typography>
            {children}
        </div>
    )
}

const Session = ({name}) => {
    return(
        <Tooltip title={name} placement="top">
            <Typography variant="body2" className={styles.session}>
                {name}
            </Typography>
        </Tooltip>
    )
}

const PresentationTitle = ({title}) => {
    return(
        <Typography  variant="h6" gutterBottom>
            {title}
        </Typography>
    )
}

const PresentationAuthors = ({author}) => {
    return(
        <Typography variant="body1" className={styles.iconAndText}>
            <Icon fontSize={"small"}>
                people
            </Icon>
            {author}
        </Typography>
    )
}

const PresentationFooter = ({reminder, file, presentationId}) =>{
    const dispatch = useDispatch();
    const token = useSelector(selectToken);

    const _add = ()=>{
        axios.post("https://ie2020.kisim.eu.org/api/reminders",
        {
            presentationId,
            notes: "",
            enabled: true
        },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((response) => {
            dispatch(addReminderFactory(presentationId, response.data))
        }).catch((e) => {});
    }

    const _delete = ()=>{
        axios.delete("https://ie2020.kisim.eu.org/api/reminders/" + reminder.id,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((response) => {
            dispatch(deleteReminderFactory(presentationId))
        }).catch((e) => {});
    }

    return(
        <footer className={styles.footer}>
            <IconButton color="primary" disabled={!file} href={"https://ie2020.kisim.eu.org/api/abstracts/" + file} target={"_blank"}>
                <Icon >
                    save_alt
                </Icon>
            </IconButton>
            <IconButton color={reminder?.enabled?"secondary":"default"} onClick={!reminder? _add:_delete}>
                <Icon>
                    {reminder?.enabled? "notifications":"add_alert"}
                </Icon>
            </IconButton>
        </footer>
    )
}