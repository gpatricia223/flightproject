const db = require('./database');

const {
    createUser,
    createEvent,
} = require('./index');

const bcrypt = require('bcrypt');
SALT_COUNT = 10;

async function dropTables() {
    try {
        console.log('Dropping all tables...');
        await db.query(`
            DROP TABLE IF EXISTS invite;
            DROP TABLE IF EXISTS rsvp;
            DROP TABLE IF EXISTS messages;
            DROP TABLE IF EXISTS groups;
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
                time TIME NOT NULL,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255),
                cost NUMERIC NOT NULL,
                location VARCHAR(255) NOT NULL,
                street VARCHAR(255) NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                zip INTEGER NOT NULL,
                author_id INTEGER REFERENCES users(user_id),
                group_id INTEGER REFERENCES groups(group_id)
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

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const seededUsers = [
            {
                username: 'groovyash',
                password: 'hailtothekind',
                firstname: 'Ashley',
                lastname: 'King'
            },

            {
                username: 'batman',
                password: 'thedarkknight',
                firstname: 'Bruce',
                lastname: 'Wayne'
            },

            {
                username: 'indescriminatefoodie',
                password: 'yumyum',
                firstname: 'Goku',
                lastname: 'Kakkarot'
            }
        ]

        console.log(seededUsers);

        await Promise.all(seededUsers.map(async user => {
            const hashPassword = bcrypt.hashSync(user.username, SALT_COUNT);
            const seededUser = await createUser({
                ...user,
                password: hashPassword
            });
            return seededUser;
        }));

        console.log ("Finished creating users!");

    }   catch (e) {
        console.error("There was a problem creating users!", e )
        throw error;
    };
};

 async function createInitialEvents() {
     try {
         const seedEvents = [
            {
                date: '2020-08-15',
                time: 18:00:00,
                title: 'Magic the Gathering Tournament',
                description: 'Join us (if the wind is low) for fun in the sun.  Try to keep your cool while climbing the ladder to the winners circle.',
                cost: '15.00',
                location: 'somewhere outside',
                street: '1345 Anywhere St',
                city: 'Alhambra',
                state: 'CA',
                zip: 91782,
                author_id: 2,
                group_id: 1
            },

            {
                date: '2020-08-22',
                time: 09:00:00,
                title: 'Beach cleanup',
                description: 'Get some social distancing and community service with us. Trash remove is still needed due to washup from sewer run off even though there are not crowds littering during this summer season.',
                cost: '0.00',
                location: 'Beach City USA',
                street: '156 Beach Street Ave',
                city: 'Huntington Beach',
                state: 'CA',
                zip: 92485,
                author_id: 1,
                group_id: 2
            },

            {
                date: '09/10/2020',
                time: 18:30:00,
                title: 'Book Club',
                description: 'Meet up with us to discuss the latest book. Arrive up to one hour early to join us for dinner and socializing, but not required. This event is open to adults only. Fee collection is only to manage adminstrative costs and hold our reservation at the venue.',
                cost: '5.00',
                location: 'Cafe Biblioteca',
                street: '269 This Place Blvd',
                city: 'Covina',
                state: 'CA',
                zip: 91724,
                author_id: 1,
                group_id: 2
            }
         ]

         console.log(seedEvents);

         await Promise.all(seedEvents.map(async event =>{
             const seededEvent = await createEvent(event);
             return seededEvent;
         }));

         console.log('Finished creating events!');

     } catch (e) {
         console.log('There was an error creating events!', e);
         throw e;
     };
 };
//createInitialGroups
//createInitialMessages
//createInitialRsvp

async function startDb() {
    try {
        await dropTables()
        await createTables()
        await createInitialUsers()
        await createInitialEvents()
    } catch (e) {
        console.error("ERROR during StartDB");
        throw error;
    };
};

startDb();