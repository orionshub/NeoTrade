const { prefix, currency } = require('../config/config.json');

module.exports = {
    name: 'claim',
    description: 'Claim random amount of currency every hour',
    usage: `${prefix}claim`,
    execute(message, args, userStats) {
        const user = userStats.get(message.author.id);
        const currentTime = Date.now();
        const lastClaimTime = user.lastClaimTime || 0;
        const difference = currentTime - lastClaimTime;
        const hourInMs = 60 * 60 * 1000;
        const cooldown = hourInMs - difference;

        if (cooldown > 0) {
            const remainingTime = new Date(cooldown).toISOString().substring(11, 11 + 8);
            return message.reply(`You have already claimed your ${currency} for this hour. Please try again in ${remainingTime}.`);
        }

        const amount = ~~(Math.random() * 10) + 1;
        user.balance += amount;
        user.lastClaimTime = currentTime;

        return message.reply(`You claimed ${amount} ${currency}! Your balance is now ${user.balance} ${currency}.`);
    },
};
