// ===== IMPORTS =====
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// ===== CONFIG (PUT YOUR IDS HERE) =====
const ADMIN_ROLES = ["1458849494178463987","1458851254808608872"];
const TARGET_ROLE = "1458892702862278766";
const ALT_VC_ID = "1438925257011499221";
const WATCH_CHANNEL = "1438917726050451489";
const BANNED_KEYWORDS = ["dick", "gay", "shit", "pussy", "fuck", "toilet", "sex", "corn", "porn", "masterbaiter", "masterbait", "children", "balls", "cock", "ass", "tits", "boobs", "nudes", "nude", "naked", "horny", "slut", "whore", "bitch", "cunt", "jerk", "suck", "cum", "pee", "piss", "fart", "butt", "butthole", "damn", "hell", "bastard", "asshole", "douche", "dildo", "vibrator", "orgasm", "creampie", "hentai", "tentacle", "bestiality", "zoophilia", "incest", "rape", "pedophilia", "loli", "shota", "trap", "femboy", "sissy", "bondage", "bdsm", "whip", "chain", "slave", "master", "daddy", "mommy", "daughter", "son", "brother", "sister", "cousin", "uncle", "aunt", "threesome", "foursome", "gangbang", "bukake", "glory", "blowjob", "handjob", "footjob", "deepthroat", "squirt", "anal", "fisting", "prolapse", "scat", "watersports", "urolagnia", "necrophilia", 
  // Obfuscated versions
  "f*ck", "f-ck", "f_ck", "fu ck", "f4ck", "f@ck", "fcck", "fvck", "phuck", "sh*t", "sh-t", "sh1t", "sh!t", "p*ssy", "p-ssy", "pu55y", "ass", "a55", "d*ck", "d-ck", "d1ck", "c*ck", "c-ck", "c0ck", "n*de", "n-de", "nud3", "p0rn", "p0rnography", "s3x", "s3xual", "b*tch", "b-tch", "b1tch", "wh0re", "wh-re", "sl*t", "sl-t", "sl00t",
  // Spanish
  "polla", "coño", "puto", "puta", "culo", "mierda", "joder", "follar", "verga", "pendejo", "culero", "sexo", "desnudo", "porno", "incesto", "violación", "pedófilo", "sodomía", "masturbarse", "eyacular", "coger", "chingar", "nalgas", "tetas", "pene", "testículos", "semen", 
  // French
  "putain", "con", "salaud", "connard", "enculé", "merci", "pénis", "testicules", "sperme", "masturbation", "baiser", "pornographie", "inceste", "viol", "pédophile", "sodomie", "éjaculation", "nudité", "nu", "érection", "fellation", "pédérastie", 
  // German
  "scheisse", "arsch", "fotze", "hurensoehne", "verdammt", "verflucht", "ficken", "nackt", "hoden", "pornographie", "inzest", "vergewaltigung", "paedophil", "ejakulation", "blasen", "wichsen", 
  // Italian
  "cazzo", "merda", "troia", "puttana", "bastardo", "maledetto", "nudo", "pornografia", "incesto", "stupro", "pedofilo", "sodomia", "masturbazione", "eiaculazione", "fellatio", "testicoli", 
  // Portuguese
  "porra", "buceta", "pau", "rola", "bunda", "testiculo", "esperma", "estupro", "masturbacao", "ejaculacao", "oral", "nudez", 
  // Russian
  "хуй", "пизда", "ебля", "блять", "мудак", "сука", "говно", "порно", "голый", "пенис", "яйца", "мастурбация", "инцест", "изнасилование", "педофил", "эякуляция", 
  // Japanese
  "ちんこ", "マンコ", "クソ", "セックス", "ポルノ", "裸", "陰茎", "睾丸", "精子", "手淫", "近親相姦", "強姦", "ペドフィリア", "肛門", "射精", "フェラチオ", 
  // Chinese Simplified
  "鸡巴", "逼", "操", "妈的", "性交", "色情", "裸", "阴茎", "睾丸", "精液", "手淫", "乱伦", "强奸", "恋童癖", "肛交", "射精", 
  // Chinese Traditional
  "雞巴", "媽的", "陰莖", "亂倫", "強姦", "戀童癖", 
  // Korean
  "씨발", "개같은", "병신", "자지", "보지", "섹스", "포르노", "나체", "음경", "고환", "정액", "자위", "근친상간", "강간", "소아성애", "항문", "사정", 
  // Dutch
  "klootzak", "kutje", "kankerziekte", "sperma", "masturbatie", "incest", "verkrachting", "pedofiel", "sodomie", "ejaculatie", "pijpen", 
  // Swedish
  "helvete", "jävla", "skit", "porr", "naken", "kuk", "balle", "våldtäkt", "pedofil", "sodomi", "utlösning", "fellatio", 
  // Polish
  "kurwa", "chuj", "gówno", "dziwka", "pornografia", "nagi", "penisem", "jajami", "masturbacja", "gwalt", "pedofil", "sodomia", "orgazm",
  // Arabic
  "قحبة", "نيك", "جنس", "عاهرة", "كس", "طيز", "زب", "تناكة", "مقروص", "عراة", "إباحي", "إباحية", "زنا", "غتصاب", "لواط", "جنس", "مجرد", "عاري", "عاريه", "ديوث", "شذوذ"];

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

function normalizeText(text) {
  // Remove common obfuscation characters: spaces, dots, dashes, underscores, numbers
  return text
    .toLowerCase()
    .replace(/[\s\.\-_*@!0-9]/g, '')  // Remove spaces, dots, dashes, underscores, numbers, special chars
    .replace(/[a-z]/g, match => match); // Keep only letters
}

function containsBannedKeyword(text) {
  const normalizedText = normalizeText(text);
  const normalizedBanned = BANNED_KEYWORDS.map(keyword => normalizeText(keyword));
  
  return normalizedBanned.some(keyword => 
    normalizedText.includes(keyword) && keyword.length > 1 // Prevent false positives on single chars
  );
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
