const { db }= require('./database')

module.exports={
    db,
    ...require('.users'),
    ...require('.events'),
    ...require('.messages'),
    ...require('.rsvp')
}