const shares = require("../data/shares.json");
const { prefix } = require("../config/config.json");

module.exports = {
    name: "buy",
    description: 'Buy shares from the market',
    args: true,
    usage: `\`${prefix}buy <share name> <amount in USD>\``,
    execute(message, args, userStats) {
        // Check if both share name and amount are provided
        if (args.length < 2) {
            return message.reply(`Invalid usage! Please use \`${this.usage}\``);
        }

        const shareName = args[0];
        const amount = parseFloat(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply("Please provide a valid amount to buy.");
        }

        const share = shares.find((s) => s.name.toLowerCase() === shareName.toLowerCase());
        if (!share) {
            return message.reply(`Share with name \`${shareName}\` not found.`);
        }

        const userInfo = userStats.get(message.author.id);
        if (userInfo.balance < amount) {
            return message.reply("You don't have enough balance to buy this share.");
        }

        const shareCount = +((amount / share.price).toFixed(2));
        if (shareCount > share.available) {
            return message.reply(`Not enough '${shareName}' shares available to buy!`);
        }

        // check for the amount
        if (shareCount === 0) {
            return message.reply(`Minimum purchase amount should be ${Math.ceil(0.01 * share.price)}`);
        }

        // Update user balance and share count
        const updatedBalance = userInfo.balance - amount;
        const userShares = userInfo.shares || {};

        if (!userShares[shareName]) {
            userShares[shareName] = {
                amount: 0,
                price: share.price
            };
        }
        userShares[shareName].amount += shareCount;

        userInfo.balance = updatedBalance;
        userInfo.shares = userShares;

        // update the shareInfo
        share.available -= shareCount;

        message.reply(`Successfully bought ${shareCount} '${shareName}' shares for ${amount} USD!`);
    }
};
