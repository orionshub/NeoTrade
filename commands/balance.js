const { prefix } = require("../config/config.json");

module.exports = {
    name: 'balance',
    description: 'Check your current balance',
    usage: `${prefix}balance`,
    execute(message, args, userStats) {
        // Get user data from the database
        const userData = userStats.get(message.author.id);

        // If user data doesn't exist, notify the user to start the bot first
        if (!userData) {
            return message.reply('Please use the `start` command to create an account first.');
        }

        // Get the user's current balance
        const balance = userData.balance;

        // Send the user's balance as a message
        return message.channel.send(`Your current balance is $${balance}`);
    }
};
