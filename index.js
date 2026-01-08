// ===== IMPORTS =====
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// ===== CONFIG (PUT YOUR IDS HERE) =====
const ADMIN_ROLES = ["1458849494178463987","1458851254808608872"];
const TARGET_ROLE = "1458892702862278766";
const ALT_VC_ID = "1438925257011499221";
const WATCH_CHANNEL = "1438917726050451489";
const BANNED_KEYWORDS = ["dick", "gay", "shit", "pussy", "fuck", "toilet", "sex", "corn", "porn", "masterbaiter", "masterbait", "children"];

const jokes = [
  "Why don’t programmers like nature? Too many bugs.",
  "Why did the computer get cold? It forgot to close its Windows.",
  "Why do Java developers wear glasses? Because they don’t C#.",
  "I told my computer I needed a break, and it froze.",
  "Why was the JavaScript developer sad? Because he didn’t know how to null his feelings."
];

let botActive = false; // Bot is off by default

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}`);
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

  // Rizz or dark joke command
  if (commandName === "rizz") {
    const jokes = [
      "Here’s some rizz 😏",
      "Dark joke incoming 🖤",
      "You have 0% chance at this rizz 😎",
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return interaction.reply({ content: joke });
  }
  // Joke command
  if (commandName === "joke") {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return interaction.reply({ content: joke });
  }
});

// ===== GIF FILTER =====
client.on("messageCreate", (message) => {
  if (message.channel.id !== WATCH_CHANNEL) return;
  if (!message.attachments.size) return;

  message.attachments.forEach((attachment) => {
    const name = attachment.name.toLowerCase();
    if (BANNED_KEYWORDS.some(keyword => name.includes(keyword))) {
      message.delete().catch(() => {});
    }
  });
});

// ===== VC CHAOS LOOP =====
setInterval(() => {
  if (!botActive) return;

  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach((member) => {
      if (!member.voice.channel) return;
      if (!member.roles.cache.has(TARGET_ROLE)) return;

      // 1/10000 chance per second
      if (Math.floor(Math.random() * 10000) === 0) {
        const targetVC = guild.channels.cache.get(ALT_VC_ID);
        Math.random() < 0.5
          ? member.voice.disconnect().catch(() => {})
          : targetVC && member.voice.setChannel(targetVC).catch(() => {});
      }
    });
  });
}, 1000);

// ===== READY =====
client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== LOGIN =====
client.login(process.env.TOKEN);
