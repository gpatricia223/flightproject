# flightproject


NEXT STEPS:
1. Create database
2. Create API routes
3. Create components


Routes (API ROUTERS):

1.

Users
    /api/users/login    POST getUserByUsername
    /api/users/register POST createUser
    /api/users/username/account PATCH updateUserByUserId
    /api/users/account/events   GET getUserEventsById
    /api/users/account/messages GET getUserMessagesById

2.

Events
    /api/events/    GET getAllEvents
    /api/events/date    GET getEventsByDate
    /api/events/create  POST createEventbyUser
    /api/events/account    PATCH updateEventByUserId
    /api/events/rsvp    GET getEventRsvpUsers

3.

API
    /api/

4.

Messages
    /api/messages   GET getAllMessages
    /api/messages/user  POST createMessage
    /api/messages/account  PATCH   updateMessagebyId

5.
RSVP
    /api/rsvp   GET getAllRsvpByUsername
    /api/rsvp/account   PATCH updateRsvpbyUserId
    /api/rsvp/attend    POST createRsvp