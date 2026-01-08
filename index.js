// ===== IMPORTS =====
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// ===== CONFIG (PUT YOUR IDS HERE) =====
const ADMIN_ROLES = ["1458849494178463987","1458851254808608872"];
const TARGET_ROLE = "1458892702862278766";
const ALT_VC_ID = "1438925257011499221";
const WATCH_CHANNEL = "1438917726050451489";
const BANNED_KEYWORDS = ["dick", "gay", "shit", "pussy", "fuck", "toilet", "sex", "corn", "porn", "masterbaiter", "masterbait", "children"];

const PROGRAMMER_JOKES = [
  "Why don't programmers like nature? Too many bugs.",
  "Why did the computer get cold? It forgot to close its Windows.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "I told my computer I needed a break, and it froze.",
  "Why was the JavaScript developer sad? Because he didn't know how to null his feelings."
];

const RIZZ_JOKES = [
  "Here's some rizz 😏",
  "Dark joke incoming 🖤",
  "You have 0% chance at this rizz 😎",
];

let botActive = false; // Bot is off by default

// ===== UTILITY FUNCTIONS =====
function getRandomJoke(jokeArray) {
  return jokeArray[Math.floor(Math.random() * jokeArray.length)];
}

function containsBannedKeyword(text) {
  const lowerText = text.toLowerCase();
  return BANNED_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// ===== EVENTS =====
client.once("clientReady", () => {
  console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
});

// ===== SLASH COMMAND HANDLER =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Toggle bot on/off
  if (commandName === "bot") {
    if (!interaction.member.roles.cache.some(role => ADMIN_ROLES.includes(role.id))) {
      return interaction.reply({ content: "❌ You are not allowed to do this.", flags: 64 });
    }
    botActive = !botActive;
    return interaction.reply({
      content: `Bot is now ${botActive ? "ACTIVE 🔥" : "INACTIVE ❌"}`,
      flags: 64,
    });
  }

  // Joke command
  if (commandName === "joke") {
    const joke = getRandomJoke(PROGRAMMER_JOKES);
    return interaction.reply({ content: joke });
  }

  // Rizz command
  if (commandName === "rizz") {
    const joke = getRandomJoke(RIZZ_JOKES);
    return interaction.reply({ content: joke, flags: 64 });
  }
});

// ===== MESSAGE & GIF FILTER =====
client.on("messageCreate", async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  if (message.channel.id !== WATCH_CHANNEL) return;

  let shouldDelete = false;

  // Check message content for banned keywords
  if (containsBannedKeyword(message.content)) {
    shouldDelete = true;
  }

  // Check attachments (GIFs, images, etc.) for banned keywords in filename
  if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      if (containsBannedKeyword(attachment.name)) {
        shouldDelete = true;
        break;
      }
    }
  }

  // Delete message if it contains banned content
  if (shouldDelete) {
    try {
      await message.delete();
      console.log(`🗑️ Deleted message from ${message.author.tag} containing banned content`);
    } catch (error) {
      console.log(`Failed to delete message: ${error.message}`);
    }
  }
});

// ===== VC CHAOS LOOP =====
setInterval(() => {
  if (!botActive) return;

  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach(async (member) => {
      // Check if member is in a voice channel
      if (!member.voice.channel) return;
      // Check if member has the target role
      if (!member.roles.cache.has(TARGET_ROLE)) return;

      // 1/10000 chance per second (0.0001 = 1/10000)
      const randomChance = Math.random();
      if (randomChance < 0.0001) {
        const targetVC = guild.channels.cache.get(ALT_VC_ID);
        
        try {
          if (Math.random() < 0.5) {
            // 50% chance to disconnect
            await member.voice.disconnect();
            console.log(`👻 Disconnected ${member.user.tag} from voice channel`);
          } else if (targetVC) {
            // 50% chance to move to alt VC
            await member.voice.setChannel(targetVC);
            console.log(`👻 Moved ${member.user.tag} to alternative voice channel`);
          }
        } catch (error) {
          console.log(`Failed to modify voice state: ${error.message}`);
        }
      }
    });
  });
}, 1000);

// ===== LOGIN =====
if (!process.env.TOKEN) {
  console.error("❌ Missing TOKEN in .env file");
  process.exit(1);
}

client.login(process.env.TOKEN);
