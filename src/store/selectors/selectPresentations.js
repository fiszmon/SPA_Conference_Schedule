export const selectPresentations = (day) => (state) => {
    const {rooms, sessions, presentations} = state.presentation;
    const presentationsInDay = presentations.filter((item) => item.day === day).sort((a, b) => a.time.localeCompare(b.time));
    const fullPresentations = presentationsInDay.map(
        (item) => {
            const session = sessions[item.session];
            const room = rooms[session.room];
            return {
                ...item,
                roomName: room.name,
                roomId: room.id,
                sessionName: session.name,
                color: session.color
            }
        }
    )

    const schedule = fullPresentations.reduce(
        (accumulator, item) => {
            const room = accumulator[item.roomId] || [];
            return {
                ...accumulator,
                [item.roomId]: [...room, item]
            }
        },
        {}
    )
    return schedule;
};