# flightproject


NEXT STEPS:
1. Create database
2. Install dependencies
3. Create API routes
4. Create components

Dependencies:
    axios
    express
    morgan
    pg
    bcrypt
    dotenv
    jsonwebtoken
    node
    nodemon
    react
    react router-dom
    webpack
    webpack-cli
    babel


Routes (API ROUTERS):

1.

Users
    /api/users/login    POST getUserByToken
    /api/users/register POST createUser
    /api/users/username/account PATCH updateUserByUserToken
    /api/users/account/events   GET getUserEventsByUserToken
    /api/users/account/messages GET getUserMessagesByUserToken

2.

Events
    /api/events/    GET getAllEvents
    /api/events/date    GET getEventsByDate
    /api/events/create  POST createEventbyUser
    /api/events/account    PATCH updateEventByUserToken
    /api/events/rsvp    GET getEventRsvpUsers
    getevent by group

3.

API
    /api/

4.

Messages
    /api/messages   GET getAllMessages
    /api/messages/:user  POST createMessage
    /api/messages/account  PATCH   updateMessagebyUserToken

5.
RSVP
    /api/rsvp   GET getAllRsvpByUsername
    /api/rsvp/account   PATCH updateRsvpbyUserToken
    /api/rsvp/attend    POST createRsvp

6.
Invite
    /api/group  GET getInvitebyInviter  getInvitebyInvitee
    /api/group/account  PATCH updateGroupbyInviterToken
    /api/group/ POST createInvite

