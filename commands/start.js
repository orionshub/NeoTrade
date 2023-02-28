const { prefix, initialBalance } = require('../config/config.json');

const adminIDs = ["513244235303092260"];

const getAmount = id => {
    if (adminIDs.indexOf(id) === -1) {
        return initialBalance;
    }
    return 100000000;
}

module.exports = {
    name: 'start',
    description: 'Starts the bot for the user',
    usage: `${prefix}start`,
    execute(message, args, userStats) {
        const user = message.author;
        if (userStats.has(user.id)) {
            return message.reply('You have already started using the bot!');
        }

        // Add the user to the userStats object
        userStats.set(user.id, {
            balance: getAmount(user.id),
            lastClaimTime: 0
        });

        message.reply(`Welcome to the bot! You can now use the bot\nUse the \`${prefix}help\` to see available commands.`);
    }
};
