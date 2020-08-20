const eventsRouter = require('express').Router();

const {createEvent, updateEvent, getAllEvent, getEventByUserId, getEventbyEventId, getEventByGroupId, deleteEvent } = require('../db');
// const {getGroupbyUserId } = require('../db');
const { requireUser } = require('./utils');
const { useLayoutEffect } = require('react');

eventsRouter.use((req, res, next) => {
    console.log('A request is being made to /events');
    next();
});

eventsRouter.get('/', async (req, res, next) =>{
    console.log('Entered get all blogs route...');

    const events = await getAllEvent();

    res.send({
        message: 'Successfully retried all events.',
        events
  })
});

eventsRouter.get('/:userId', async (req, res, next) => {
    const { userId } = req.params;
    console.log("UserId: ", userId);

    try {
        const userEvents = await getEventByUserId(userId);

        if (userEvents) {
            res.send({
                message: 'Successfully retrieved user events.',
                userEvents
            });
            console.log("User Events: ", userEvents);
        } else {
            next({
                error: "EventsRetrievalError",
                message: `Unable to retrieve events by userId: ${userId}`
            })
        };
    } catch ({ error, message }) {
        next({ error, message });
    };
});

eventsRouter.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;

    try {
        const groupEvents = await getEventByGroupId(groupId);

        if (groupEvents) {
            res.send({
                message: 'Successfully retrieved events by groupId',
                groupEvents
            });
        } else {
            next({
                error: "failedToRetrieveEventsError",
                message: `Unable to retrieve events by GroupId: ${groupId}`
            })
        }
    }  catch ({ error, message }) {
        next({ error, message})
    }
});

eventsRouter.patch('/:eventId', requireUser, async (req, res, next) => {
    const { eventId } = req.params;
    const { date, time, title, description, cost, location, street, city, state, zip, author_id } = req.body;
    const user = req.user;

    if (user && user.user_id === author_id) {
        try {
            const event = getEventbyEventId(eventId);
            if (event) {
                const updatedEvent = await updateEvent(eventId, {
                    date,
                    time,
                    title,
                    description,
                    cost,
                    location,
                    street,
                    city,
                    state,
                    zip
                });
                res.send({
                    message: 'You have successfully updated your event.',
                    updatedEvent,
                    status: true
                });
                console.log("Update event: ", updatedEvent);
            } else {
                next({
                    error: "BlogUpdateError",
                    message: "You cannot update an event that is not yours."
                })
            };
        } catch ({ error, message}) {
            next({ error, message});
        };
    }
});

eventsRouter.post('/', requireUser, async (req, res, next) => {
    const user = req.user;

    const { date, time, title, description, cost, location, street, city, state, zip, author_id } = req.body;

    if (user) {
        try {
            const event = await createEvent({
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
                author_id
            });

            if (event) {
                res.send({
                    message: 'Successfully created new event.',
                    event,
                    status: true
                });

            } else {
                next({
                    error: 'CreateNewEventError',
                    message: "Error creating new event."
                });
            }
        } catch ({ error, message }) {
            next({ error, message });
        };
    }
});

eventsRouter.delete('/:eventId', requireUser, async (req, res, next) => {
    const { eventId } = req.params;
    console.log('Delete route eventId: ', eventId);
    const user = req.user;
    console.log('Delete route user', user);

    try {
        const event = await getEventbyEventId(eventId);
        console.log('eventId: ', event);
        const { authorId } = event;
        console.log('AUTHORid:', authorId)

        if (event && user.user_id === authorId) {
            console.log('In the first statement!')
            const deletedEvent = await deleteEvent(eventId);

            res.send({
                message: `Successfully deleted event: ${eventId}`,
                deletedEvent,
                status: true
            })
        } else {
            next({
                error: 'FailedToDeleteEventError',
                message: 'Unable to delete blog'
            })
        }
    }  catch ({ error, message }) {
        next({ error, message });
    };
});

module.exports = eventsRouter;