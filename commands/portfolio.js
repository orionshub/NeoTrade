const { EmbedBuilder } = require("discord.js");
const { prefix } = require('../config/config.json');

module.exports = {
    name: 'portfolio',
    description: 'Displays your portfolio of shares',
    usage: `${prefix}portfolio`,
    execute: async (message, args, userStats) => {
        const userData = userStats.get(message.author.id);

        if (!userData) {
            return message.reply('Please use the `!start` command to begin');
        }

        const { shares = {} } = userData;

        if (Object.keys(shares).length === 0) {
            return message.reply('Your portfolio is currently empty');
        }

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username}'s portfolio`)
            .setColor('#ff0000');

        Object.keys(shares).forEach((shareName) => {
            const shareData = shares[shareName];
            embed.addFields({
                name: shareName,
                value: `Available share: ${shareData.amount}\nbought at: $${shareData.price}\ntotal: $${shareData.amount * shareData.price}\n`
            });
        });

        message.channel.send({ embeds: [embed] });
    },
};
