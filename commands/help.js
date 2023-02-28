const { EmbedBuilder } = require("discord.js");
const config = require("../config/config.json");

module.exports = {
    name: "help",
    description: "Displays a list of available commands and their usage",
    usage: `${config.prefix}help`,
    execute(message, args) {
        const { commands } = message.client;

        // if there are no arguments, send list of commands
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle("Available commands:")
                .setDescription(commands.map(command => `\`${config.prefix}${command.name}\` - ${command.description}`).join("\n"));
            return message.channel.send({ embeds: [embed] });
        }

        // if there is a specific command provided, send details of that command
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));

        if (!command) {
            return message.reply("That\'s not a valid command!");
        }

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`Command: \`${config.prefix}${command.name}\``)
            .setDescription(`${command.description}\n\n**Usage:** \`${command.usage}\``);

        if (command.aliases) {
            embed.addFields({ name: "Aliases", value: command.aliases.map(alias => `\`${alias}\``).join(", ") });
        }

        message.channel.send({ embeds: [embed] });
    },
};
