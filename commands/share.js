const { EmbedBuilder } = require("discord.js");
const shares = require("../data/shares.json");
const { prefix, embedColor } = require('../config/config.json');

const SHARES_PER_PAGE = 10;

module.exports = {
    name: "share",
    description: "Get the details of a specific share or list of all available shares",
    usage: `${prefix}share <shareName - optional>`,
    execute(message, args) {
        let page = 1;

        const shareName = args[0];
        if (shareName) {
            const shareInfo = shares.find(share => share.name.toLowerCase() === shareName.toLowerCase());
            if (shareInfo) {
                const shareDetails = `Price: ${shareInfo.price} USD | Available: ${shareInfo.available} units`;
                message.reply(shareDetails);
            } else {
                message.reply(`\`${shareName}\` is not a valid share name`);
            }
            return;
        }

        const generateEmbed = () => {
            const shareNames = Object.keys(shares);
            const totalPages = Math.ceil(shareNames.length / SHARES_PER_PAGE);

            if (page < 1) {
                page = 1;
            } else if (page > totalPages) {
                page = totalPages;
            }

            const startIndex = (page - 1) * SHARES_PER_PAGE;
            const sharesList = shareNames.slice(startIndex, startIndex + SHARES_PER_PAGE);

            const embed = new EmbedBuilder()
                .setTitle(`Available shares (page ${page}/${totalPages})`)
                .setColor(embedColor);               

            sharesList.forEach((shareName) => {
                const share = shares[shareName];
                const shareDetails = `Price: ${share.price} USD | Available: ${share.available} units`;
                embed.addFields({name: share.name, value: shareDetails});
            });

            return embed;
        };

        message.channel.send({ embeds: [generateEmbed()]}).then((msg) => {
            msg.react("⬅️").then(() => msg.react("➡️"));

            const filter = (reaction, user) => {
                return ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            
            const collector = msg.createReactionCollector({ filter, time: 1000 * 60 * 5 });
            setTimeout(() => {})
            collector.options.dispose = true;

            collector.on("collect", reaction => {
                if (reaction.emoji.name === "⬅️") {
                    page--;
                } else if (reaction.emoji.name === "➡️") {
                    page++;
                }

                msg.edit({ embeds: [generateEmbed()] });
            });

            collector.on("remove", reaction => {
                if (reaction.emoji.name === "⬅️") {
                    page--;
                } else if (reaction.emoji.name === "➡️") {
                    page++;
                }

                msg.edit({ embeds: [generateEmbed()] });
            });
        });
    },
};
