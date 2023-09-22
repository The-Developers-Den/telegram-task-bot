const TelegramBot = require("node-telegram-bot-api");
const { addTask, findTasks } = require("./prisma/helper");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const checkGroup = (type) => {
  return type === "group";
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Hello ${
      msg.from.first_name || "User"
    } use,\n/add <i>[your task title]</i> - to create a task in the private chat with the bot\n/do <i>[title] @[username]</i> - to assign tasks to other\n/tasks - to list your tasks
    `,
    { parse_mode: "HTML" }
  );
});

bot.onText(/\/add (.+)/, async (msg, match) => {
  const task = match[1];
  const chatId = msg.chat.id;

  if (!checkGroup(msg.chat.type)) {
    bot.sendMessage(chatId, "⏱️ Adding task...");
    addTask(task, msg.from.username, msg.from.username, msg.chat.type)
      .then((resp) => {
        bot.sendMessage(chatId, `✅ Task <i>${resp.task}</i>  added`, {
          parse_mode: "HTML",
        });
      })
      .catch((err) => {
        console.log(err);
        bot.sendMessage(chatId, "⚠️ Something went wrong, try again later!");
      });
  } else {
    bot.sendMessage(chatId, "🙅 Only available in private chat");
  }
});

bot.onText(/\/do (.+) @(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const task = match[1];
  const username = match[2];

  if (checkGroup(msg.chat.type)) {
    addTask(task, username, msg.from.username, msg.chat.title)
      .then((resp) => {
        bot.sendMessage(
          chatId,
          `✅ Task <i>${resp.task}</i> assigned to ${resp.assignee}`,
          {
            parse_mode: "HTML",
          }
        );
      })
      .catch((err) => {
        console.log(err);
        bot.sendMessage(chatId, "⚠️ Something went wrong, try again later !");
      });
  } else {
    bot.sendMessage(chatId, "🔴 Connect to group 🔴");
  }
});

bot.onText(/\/tasks/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const tasks = await findTasks(username);
  tasks.map((task) => {
    bot.sendMessage(
      chatId,
      `📝 Task: <i>${task.task}</i> \n🚩 From: ${
        task.under === "private"
          ? "self"
          : `<strong>${task.under}</strong> (@${task.assignor})`
      } \n🚧 Status: ${task.status}`,
      {
        parse_mode: "HTML",
      }
    );
  });
});
