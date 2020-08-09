const bcrypt = require('bcrypt');
SALT_COUNT = 10;

async function dropTables() {
    try {
        console.log('Dropping all tables...');
        await db.query(`
            DROP TABLE IF EXISTS invite;
            DROP TABLE IF EXISTS rsvp;
            DROP TABLE IF EXISTS messages;
            DROP TABLE IF EXISTS events;
            DROP TABLE IF EXISTS users;
            `);
        console.log("Successfully dropped all tables.");
    }  catch (e) {
        console.error("Error dropping tables!");
        throw error;
    };
};

async function createTables() {

    try {

        console.log("Building new tables...");

        console.log("Creating users...")
        await db.query(`
            CREATE TABLE IF NOT EXISTS users(
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `);

        console.log("Creating events...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS events(
                event_id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                ***  time *** ,
                description VARCHAR(255) NOT NULL,
                ****  where LOCATION  ***,
                author_id INTEGER REFERENCES users(user_id)  
            );
        `);

        console.log("Creating groups...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS groups(
                group_id SERIAL PRIMARY KEY,
                inviter_id INTEGER REFERENCES users(user_id) ,
                invited_id INTEGER REFERENCES users(user_id) ,
                accepted BOOLEAN DEFAULT false
            );
        `);

        console.log("Creating messages...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages(
                message_id SERIAL PRIMARY KEY,
                content VARCHAR(255) NOT NULL,
                author_id INTEGER REFERENCES users(user_id)
            );
        `);

        console.log("Creating RSVP");
        await db.query(`
            CREATE TABLE IF NOT EXISTS rsvp(
                rvsp_id SERIAL PRIMARY KEY,
                user_rsvp INTEGER REFERENCES users(user_id) 
                attending BOOLEAN DEFAULT true,
            );
        `);

        console.log("Tables successfully built!");
    } catch (e) {
        console.error("Error creating tables!");
        throw error;
    };
};

async function startDb() {
    try {
        await dropTables()
        await createTables()
    } catch (e) {
        console.error("ERROR during StartDB");
        throw error;
    };
};

startDb();