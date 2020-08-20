const db = require('./database');

//getAllEvent
async function getAllEvent() {
    const {rows: eventIds } = await db.query(`
    SELECT event_id FROM events;
    `)
    console.log(eventIds);
    const events = await Promise.all(eventIds,map(
        event => getEventByUserId(event.event_id)))

    return events;
}

// getEventByUserId
async function getEventByUserId(userId) {
    try {
        const { rows: [events]} = await db.query(`
        SELECT *
        FROM events
        WHERE author_id= $1;
        `, [userId]);

        return events;
    } catch (e) {
        throw e;
    };
}

//getEventByEventId
async function getEventByEventId(eventId) {
    try {
        const { rows: [event] } = await db.query(`
        SELECT *
        FROM events
        WHERE event_id=$1;
        `, [eventId])

        return event;
    } catch (e) {
        console.error(e);
    };
};

//getEventsbyGroup
async function getEventsByGroup(groupId) {
    try {
        const { rows: [event] } = await db.query(`
        SELECT *
        FROM events
        WHERE group_id=$1;
        `, [groupId]);

        return event;
    } catch (e) {
        console.error(e);
    };
};

//createEvent
async function createEvent({ 
    date, 
    time, 
    title,
    description,
    cost,
    location,
    street,
    city,
    state,
    zip,
    author_id})  {
        try {
            console.log('Entered db createEvent');
            const { rows: [event] } = await db.query(`
            INSERT INTO events(date, time, title, description, cost, location, street, city, state, zip, author_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `, [date, time, title, description, cost, location, street, city, state, zip, author_id]);

            console.log('Successfully created event');
            return event;
        } catch (e) {
            throw e;
        }
    }
//updateEvent
async function updateEvent(eventId, userId, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    );

    console.log(fields);
    console.log(setString);
    //return early if this is called without fields
    if (setString.length === 0) {
        return;
    };

    try {
        const { rows: [result] } = await db.query(`
        UPDATE events
        SET ${setString.join(",")}
        WHERE event_id=$${ setString.length+1 } AND author_id=$${setString.length+2}
        RETURNING *;
        `, [...Object.values(fields), eventId, userId]);

        return result;
    } catch (e) {
        throw e;
    }
}

async function deleteEvent(eventId) {
    try {
        const {rows: [event] } = await db.query(`
        DELETE FROM events
        WHERE event_id=$1
        RETURNING *;
        `, [eventId]);

        return event;

    } catch (e) {
        console.error(e);
    };
};



module.exports = {
    createEvent,
    updateEvent,
    getAllEvent,
    getEventByUserId,
    getEventByEventId, 
    getEventsByGroup,
    deleteEvent
};