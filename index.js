// Import the required modules
const Discord = require("discord.js");
const fs = require('fs');
require("dotenv").config();
const { prefix } = require("./config/config.json");

// Initialize the Discord client
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessageReactions
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent
    ]
});

// Login to Discord using your bot token
client.login(process.env.BOT_TOKEN);

// Log a message to the console when the bot is ready
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  
    // set the collection of the commands
    client.commands = new Discord.Collection();

    // read the directory for the commands
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

// create users hash map
// At the top of your index.js file:
const userStats = new Map();

// listen for message
client.on("messageCreate", message => {
    // ignore if the message is sent by a bot or it doesn't have the prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // parse the message content and split it into the array of words
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        if (command.name !== "start") {
            // Check if user has started the bot or not
            if (!userStats.has(message.author.id)) {
                message.reply('Please use the `!start` command first to start the bot.');
                return;
            }
        }
        command.execute(message, args, userStats);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});
