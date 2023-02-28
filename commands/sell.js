const { getShareData } = require("../utils/shares");
const { formatNumber } = require("../utils/utils");
const { prefix } = require("../config/config.json");

module.exports = {
    name: 'sell',
    description: 'Sell a certain amount of a stock from your portfolio',
    usage: `${prefix}sell <stock name> <amount>`,
    execute(message, args, userStats) {
        // Get user data
        const userData = userStats.get(message.author.id);

        // Check if correct number of arguments are provided
        if (args.length < 2) {
            return message.channel.send(`Please provide a stock name and the amount of shares to sell.\nUsage: \`${this.usage}\``);
        }

        const shareName = args[0].toLowerCase();
        const sellAmount = Number(args[1]);

        // Check if amount is valid
        if (isNaN(sellAmount) || sellAmount <= 0) {
            return message.channel.send(`Please provide a valid amount to sell.\nUsage: \`${this.usage}\``);
        }

        // Get the share data
        const shareData = getShareData(shareName);

        // Check if share exists
        if (!shareData) {
            return message.channel.send(`Sorry, ${shareName} is not a valid stock name. Please check the stock name and try again.`);
        }

        // Check if user has enough shares to sell
        if (!userData.shares[shareName] || userData.shares[shareName].amount < sellAmount) {
            return message.channel.send(`Sorry, you do not have enough ${shareName} shares to sell.`);
        }

        // Calculate the total value of the shares to sell
        const totalPrice = shareData.price * sellAmount;

        // Update the user's portfolio and balance
        userData.balance += totalPrice;
        userData.shares[shareName].amount = +(userData.shares[shareName].amount - sellAmount).toFixed(2);

        // Remove the share from the user's portfolio if the amount is zero
        if (userData.shares[shareName].amount === 0) {
            delete userData.shares[shareName];
        }

        // update the share again
        shareData.available += sellAmount;

        // Format the numbers for display
        const formattedPrice = formatNumber(totalPrice, 2);
        const formattedAmount = formatNumber(sellAmount, 0);
        const formattedBalance = formatNumber(userData.balance, 2);

        // Send confirmation message
        message.channel.send(`You have successfully sold ${formattedAmount} ${shareName} share(s) for ${formattedPrice} USD.\nYour updated balance is ${formattedBalance} USD.`);
    },
};
