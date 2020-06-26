import React, {Fragment, useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import styles from "./Home.module.css";
import {Presentation} from "./Components/Presentation";
import {useDispatch, useSelector} from "react-redux";
import {selectDays} from "../../store/selectors/selectDays";
import {selectPresentations} from "../../store/selectors/selectPresentations";
import {selectRooms} from "../../store/selectors/selectRooms";
import {selectSelectedDay} from "../../store/selectors/selectSelectedDay";
import {selectDayFactory} from "../../store/actions/selectDay";
import CircularProgress from "@material-ui/core/CircularProgress";
import {fetchPresentationsService} from "../../DataService/fetchPresentations";
import {selectPending} from "../../store/selectors/selectPending";
import {selectToken} from "../../store/selectors/selectToken";

export function Home() {
    const dispatch = useDispatch();
    const selectedDay = useSelector(selectSelectedDay);
    const days = useSelector(selectDays);
    const presentations = useSelector(selectPresentations(selectedDay));
    const rooms = useSelector(selectRooms);
    const pending = useSelector(selectPending);
    const token = useSelector(selectToken);

    useEffect(() => {
        if (presentations.length > 0)
            return;
        else
            fetchPresentationsService(dispatch, days, token);
    }, [dispatch, days, token, presentations.length]);

    const onTabChange = (day) => dispatch(selectDayFactory(day));
    const columnsCount = Object.values(rooms).map(room => presentations[room.id]).filter(Boolean).length;

    return (
        <Fragment>
            {pending ?
                <CircularProgress/> :
                (<div>
                        <Paper elevation={1} square>
                            <Tabs
                                variant="scrollable"
                                scrollButtons="auto"
                                style={{
                                    minWidth: '100%',
                                    overflow: 'auto'}}
                                value={selectedDay} onChange={(obj, v) => onTabChange(v)}>
                                {
                                    days.map((day) => <Tab key={day} label={day} value={day}/>)
                                }
                            </Tabs>
                        </Paper>
                        <div className={styles.columns} style={{gridTemplateColumns: `repeat(${columnsCount}, minmax(0,1fr))`}}>
                                {
                                    Object.values(rooms).map((room) => {
                                        const roomPresentations = presentations[room.id];
                                        if (!roomPresentations)
                                            return null;
                                        return (
                                            <div key={room.id}>
                                                <Typography variant="h6" gutterBottom>
                                                    {room.name}
                                                </Typography>
                                                {
                                                    roomPresentations.map((pres) => (
                                                        <Presentation
                                                            key={pres.id}
                                                            id={pres.id}
                                                            time={pres.time}
                                                            session={pres.sessionName}
                                                            title={pres.title}
                                                            author={pres.authors.join(', ')}
                                                            color={pres.color}
                                                            file={pres.filename}
                                                            reminder={pres.reminder}
                                                        />

                                                    ))
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    </div>
                )}
        </Fragment>
    );
}