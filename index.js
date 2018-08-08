// External libraries being loaded at the beginning
const TelegramBot = require('node-telegram-bot-api');
const Emoji = require('node-emoji').emoji;
// Local libraries and configurating local constants
const config = require('./config');
// Configurating our main piece of code
const bot = new TelegramBot(config.telegram.token, {polling: true});

let doors = false;

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Hi ${msg.from.first_name}, wie kann ich dir helfen?`, {
    'reply_markup': {
      'keyboard': [
        [`${Emoji.unlock} ${config.text.opened}`, `${Emoji.lock} ${config.text.closed}`], 
        ['Ist gerade jemand unten?']]
    }
  })
});

bot.onText(/\/open/, (msg) => {
  if(msg.chat.id === config.telegram.channel) {
    open();
  }
});

bot.onText(/Geöffnet$/, (msg) => {
  bot.getChatMember(config.telegram.channel, msg.chat.id).then((channel) => {
    if(channel.user.id === msg.chat.id) {
      open();
    }
  });
});

bot.onText(/\/close/, (msg) => {
  if(msg.chat.id === config.telegram.channel) {
    close();
  }
});

bot.onText(/Geschlossen$/, (msg) => {
  bot.getChatMember(config.telegram.channel, msg.chat.id).then((channel) => {
    if(channel.user.id === msg.chat.id) {
      close();
    }
  });
});

bot.onText(/\/doors/, (msg) => {
  console.log(msg.chat.first_name, 'Requesting doors status');

  bot.sendMessage(msg.chat.id, (doors) ? 'Hereinspaziert! Das Faust ist offen!' : 'Sorry Bro, leider geschlossen :(');
});

bot.onText(/(((jemand).*?(da|unten|im|in))|((unten|im|in).*?faust)|(ist.*?(offen|geöffnet))).*?\?$/, (msg) => {
  console.log(msg);
  bot.sendMessage(msg.chat.id, (doors) ? `Klar ${msg.from.first_name}, es ist offen! Komm vorbei :)` : `Sorry ${msg.from.first_name}, gerade ist niemand da :/`);
});

function open() {
  doors = true;
  if(msg.from.first_name) {
    bot.sendMessage(config.telegram.channel, `${msg.from.first_name} hat soeben das Faust aufgeschlossen. Kommt vorbei, wenn ihr Bock habt!`);
  }
  return;
}

function close() {
  doors = false;
  if(msg.from.first_name) {
    bot.sendMessage(config.telegram.channel, `Das Faust wurde soeben abgeschlossen. Tschüss ${msg.from.first_name}!`);
  }
  return;
}
