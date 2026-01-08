// ===== IMPORTS =====
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// ===== CONFIG =====
const ADMIN_ROLES = ["1458849494178463987", "1458851254808608872"];
const TARGET_ROLE = "1458892702862278766";
const ALT_VC_ID = "1438925257011499221";
const WATCH_CHANNEL = "1438917726050451489";

// Your banned keywords list (keep yours)
const BANNED_KEYWORDS = [
  "dick","gay","shit","pussy","fuck","toilet","sex","corn","porn","masterbaiter","masterbait","children","balls","cock",
  "ass","tits","boobs","nudes","nude","naked","horny","slut","whore","bitch","cunt","jerk","suck","cum","pee","piss",
  "fart","butt","butthole","damn","hell","bastard","asshole","douche","dildo","vibrator","orgasm","creampie","hentai",
  "tentacle","bestiality","zoophilia","incest","rape","pedophilia","loli","shota","trap","femboy","sissy","bondage",
  "bdsm","whip","chain","slave","master","daddy","mommy","daughter","son","brother","sister","cousin","uncle","aunt",
  "threesome","foursome","gangbang","bukake","glory","blowjob","handjob","footjob","deepthroat","squirt","anal",
  "fisting","prolapse","scat","watersports","urolagnia","necrophilia",
  "polla","coño","puto","puta","culo","mierda","joder","follar","verga","pendejo","culero","sexo","desnudo","porno",
  "incesto","violación","pedófilo","sodomía","masturbarse","eyacular","coger","chingar","nalgas","tetas","pene",
  "testículos","semen",
  "putain","con","salaud","connard","enculé","merci","pénis","testicules","sperme","masturbation","baiser","pornographie",
  "inceste","viol","pédophile","sodomie","éjaculation","nudité","nu","érection","fellation","pédérastie",
  "scheisse","arsch","fotze","hurensoehne","verdammt","verflucht","ficken","nackt","hoden","pornographie","inzest",
  "vergewaltigung","paedophil","ejakulation","blasen","wichsen",
  "cazzo","merda","troia","puttana","bastardo","maledetto","nudo","pornografia","incesto","stupro","pedofilo","sodomia",
  "masturbazione","eiaculazione","fellatio","testicoli",
  "porra","buceta","pau","rola","bunda","testiculo","esperma","estupro","masturbacao","ejaculacao","oral","nudez",
  "хуй","пизда","ебля","блять","мудак","сука","говно","порно","голый","пенис","яйца","мастурбация","инцест",
  "изнасилование","педофил","эякуляция",
  "ちんこ","マンコ","クソ","セックス","ポルノ","裸","陰茎","睾丸","精子","手淫","近親相姦","強姦",
  "ペドフィリア","肛門","射精","フェラチオ",
  "鸡巴","逼","操","妈的","性交","色情","裸","阴茎","睾丸","精液","手淫","乱伦","强奸","恋童癖","肛交","射精",
  "雞巴","媽的","陰莖","亂倫","強姦","戀童癖",
  "씨발","개같은","병신","자지","보지","섹스","포르노","나체","음경","고환","정액","자위","근친상간","강간",
  "소아성애","항문","사정",
  "klootzak","kutje","kankerziekte","sperma","masturbatie","incest","verkrachting","pedofiel","sodomie","ejaculatie","pijpen",
  "helvete","jävla","skit","porr","naken","kuk","balle","våldtäkt","pedofil","sodomi","utlösning","fellatio",
  "kurwa","chuj","gówno","dziwka","pornografia","nagi","penisem","jajami","masturbacja","gwalt","pedofil","sodomia","orgazm",
  "قحبة","نيك","جنس","عاهرة","كس","طيز","زب","تناكة","مقروص","عراة","إباحي","إباحية","زنا","غتصاب","بيدوفيل","لواط",
  "مجرد","عاري","عاريه","ديوث","شذوذ",
  "nigga","nigger",
];

// ===== OPTIONAL SAFE WORDS (prevents false positives) =====
// Add any normal words that accidentally match your banned list after normalization.
const SAFE_WORDS = [
  "class", "classic", "assistant", "pass", "passage", "grass", "merci"
];

// ===== JOKES =====
const PROGRAMMER_JOKES = [
  "Why don't programmers like nature? Too many bugs.",
  "Why did the computer get cold? It forgot to close its Windows.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "I told my computer I needed a break, and it froze.",
  "Why was the JavaScript developer sad? Because he didn't know how to null his feelings.",
];

const RIZZ_JOKES = [
  "Here's some rizz 😏",
  "Dark joke incoming 🖤",
  "You have 0% chance at this rizz 😎",
];

let botActive = false;

// =========================================================
// ===== PERFECT(ISH) FILTER ENGINE (FAST + ANTI-BYPASS) ====
// =========================================================

// Normalize hard: lowercase, strip accents, remove zero-width, convert leetspeak, keep spaces.
function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")        // accents/diacritics
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
    .replace(/[@$]/g, "s")                 // optional: map symbols
    .replace(/!/g, "i")
    .replace(/\|/g, "i")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z0-9]+/g, " ")           // keep spaces to allow word boundaries
    .replace(/\s+/g, " ")
    .trim();
}

// Escape regex special chars
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build word-boundary regex, plus allow spaced letters like "f u c k"
function buildBannedRegex(word) {
  const w = normalize(word);
  if (!w || w.length < 3) return null;

  // Example for "fuck": allow "f u c k" and also "f..u..c..k" after normalization -> spaces remain
  // We'll build a token pattern that allows optional spaces between letters.
  const letters = w.replace(/\s+/g, "").split("");
  const spaced = letters.map(ch => `${escapeRegex(ch)}\\s*`).join("");
  // Word boundaries on both sides (start/space and end/space)
  return new RegExp(`(^|\\s)${spaced}(\\s|$)`, "i");
}

// Sets for quick lookups
const SAFE_SET = new Set(SAFE_WORDS.map(normalize).filter(Boolean));
const BANNED_SET = new Set(BANNED_KEYWORDS.map(normalize).filter(Boolean));

// Compile regexes once
const BANNED_REGEXES = [...BANNED_SET]
  .filter(w => w.length >= 3)
  .map(buildBannedRegex)
  .filter(Boolean);

// Optional: find what triggered (useful for logs)
function getTriggeredWord(text) {
  const n = normalize(text);
  for (let i = 0; i < BANNED_REGEXES.length; i++) {
    if (BANNED_REGEXES[i].test(n)) return [...BANNED_SET][i] || "unknown";
  }
  return null;
}

function containsBanned(text) {
  const n = normalize(text);
  if (!n) return false;

  // SAFE words shortcut (prevents classic false positives)
  for (const safe of SAFE_SET) {
    if (safe && n.includes(safe)) return false;
  }

  return BANNED_REGEXES.some(re => re.test(n));
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

// ===== READY =====
client.once("clientReady", () => {
  console.log(`✅ Bot ready as ${client.user.tag}`);
});

// ===== SLASH COMMANDS =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "bot") {
    if (!interaction.member.roles.cache.some((r) => ADMIN_ROLES.includes(r.id))) {
      return interaction.reply({ content: "❌ No permission", flags: 64 });
    }
    botActive = !botActive;
    return interaction.reply({
      content: `Bot is now ${botActive ? "ACTIVE 🔥" : "INACTIVE ❌"}`,
      flags: 64,
    });
  }

  if (interaction.commandName === "joke") {
    return interaction.reply({
      content:
        PROGRAMMER_JOKES[Math.floor(Math.random() * PROGRAMMER_JOKES.length)],
    });
  }

  if (interaction.commandName === "rizz") {
    return interaction.reply({
      content: RIZZ_JOKES[Math.floor(Math.random() * RIZZ_JOKES.length)],
      flags: 64,
    });
  }
});

// ===== MESSAGE FILTER =====
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== WATCH_CHANNEL) return;

  // Optional: Admin bypass for filtering
  if (message.member?.roles?.cache?.some((r) => ADMIN_ROLES.includes(r.id))) return;

  let flagged = false;

  // Check message content
  if (containsBanned(message.content)) flagged = true;

  // Check attachments (name + url)
  if (!flagged) {
    for (const att of message.attachments.values()) {
      const check = `${att.name || ""} ${att.url || ""}`;
      if (containsBanned(check)) {
        flagged = true;
        break;
      }
    }
  }

  if (flagged) {
    try {
      const triggered = getTriggeredWord(message.content) || "unknown";
      await message.delete();
      console.log(`🗑️ Deleted: ${message.author.tag} | word: ${triggered}`);
    } catch (e) {
      console.log("Delete failed:", e.message);
    }
  }
});

// ===== VC CHAOS =====
setInterval(() => {
  if (!botActive) return;

  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach(async (member) => {
      if (!member.voice.channel) return;
      if (!member.roles.cache.has(TARGET_ROLE)) return;

      if (Math.random() < 0.0001) {
        try {
          if (Math.random() < 0.5) {
            await member.voice.disconnect();
          } else {
            const vc = guild.channels.cache.get(ALT_VC_ID);
            if (vc) await member.voice.setChannel(vc);
          }
        } catch {}
      }
    });
  });
}, 1000);

// ===== LOGIN =====
if (!process.env.TOKEN) {
  console.error("❌ Missing TOKEN");
  process.exit(1);
}

client.login(process.env.TOKEN);
