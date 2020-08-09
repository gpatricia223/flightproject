const db = require('./database');
const { getEventsByUserId } = require('./events');


async function createUser({ username, password, firstname, lastname }) {

    try {
        const { rows: [ user ] } = await db.query(`
                INSERT INTO users(username, password, firstname, lastname) 
                VALUES($1, $2, $3, $4) 
                ON CONFLICT (username) DO NOTHING 
                RETURNING *;
            `, [ username, password, firstname, lastname ]);

        return user;
    } catch (error) {
        throw error;
    };

};

async function updateUser(userId, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows: [ user ] } = await db.query(`
            UPDATE users
            SET ${ setString }
            WHERE user_id=${ userId }
            RETURNING *;
        `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    };

};

async function getUserByUserId(userId) {

    try {
        const { rows: [ user ] } = await db.query(`
            SELECT user_id, username, firstname, lastname, active
            FROM users
            WHERE user_id=$1;
        `, [ userId ]);

        const { rows: [ userEvents ] } = await db.query(`
            SELECT *
            FROM events
            WHERE "userId"=$1;
        `, [ userId ]);

        user.events = userEvents
        
        return user;
    } catch (error) {
        throw error;
    };

};

async function getUserByUsername(username) {

    try {
        const { rows: [ user ] } = await db.query(`
            SELECT *
            FROM users
            WHERE username=$1
        `, [ username ]);

        return user;
    } catch (error) {
        throw error;
    };

};

async function getAllUsers() {

    console.log("IN GETALLUSERS")
    try {
        const { rows: userIds } = await db.query(`
            SELECT user_id, username, firstname, lastname, active
            FROM users;
    `);

    console.log(">>>USERIDS<<<", userIds);

    const users = await Promise.all(userIds.map(
        user => getUserByUserId(user.user_id)
    ));

    console.log(">>>USERS<<<", users);

        return users;
    } catch (error) {
        throw error;
    };

};

module.exports = {
    createUser,
    updateUser,
    getUserByUserId,
    getUserByUsername,
    getAllUsers,
};
