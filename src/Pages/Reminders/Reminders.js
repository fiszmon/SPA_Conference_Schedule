import React from "react";
import {useSelector} from "react-redux";
import {selectReminders} from "../../store/selectors/selectReminders";
import {selectShortPresentations} from "../../store/selectors/selectShortPresentations";
import {Presentation} from "../Home/Components/Presentation";
import {selectSessions} from "../../store/selectors/selectSessions";
import Masonry from "react-masonry-css";
import "./Reminders.css";


const breakpointColumnsObj = {
    default: 5,
    1500: 4,
    1200: 3,
    900: 2,
    600: 1
};

export const Reminders = () => {
    const reminders = useSelector(selectReminders);
    const presentations = useSelector(selectShortPresentations);
    const sessions = useSelector(selectSessions);

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {
                reminders.map((reminder, i) => {
                    const pres = presentations.find((item) => item.id === reminder.presentationId);
                    const se = sessions[pres.session];
                    return (
                            <Presentation
                                key={pres.id}
                                id={pres.id}
                                time={pres.time}
                                session={se.name}
                                title={pres.title}
                                author={pres.authors.join(', ')}
                                color={se.color}
                                file={pres.filename}
                                reminder={pres.reminder}
                                day={pres.day}
                            />
                    )
                })
            }
        </Masonry>
    );
};