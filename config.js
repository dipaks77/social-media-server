const config = {

    dev: {
        port: 8080,
        dbURL: 'mongodb+srv://dipaksumesara:Dipak@123@cluster0.cceik.mongodb.net/social-media?retryWrites=true&w=majority',
        secret: 'aBcD@123'
    },

    prod: {
        port: 8080,
        dbURL: 'mongodb+srv://dipaksumesara:Dipak@123@cluster0.cceik.mongodb.net/social-media?retryWrites=true&w=majority',
        secret: 'aBcD@123'
    }
}

module.exports = process.env.NODE_ENV === 'production' ? config.prod : config.dev