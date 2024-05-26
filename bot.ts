import { Bot, Context, session, SessionFlavor } from "grammy/mod.ts";
import { freeStorage } from "grammy_storages/free/src/mod.ts";
import { emojiKeyboard } from "./all_contributors.ts";

type SessionData = {
  allContributors: {
    sender: string;
    repo: string;
    keys: string[];
  };
};

type GhbContext = Context & SessionFlavor<SessionData>;

const token = Deno.env.get("TELEGRAM_TOKEN") ?? "";

const bot = new Bot<GhbContext>(token);

bot.use(session({
  initial: () => ({
    allContributors: {
      sender: "",
      repo: "",
      keys: [],
    },
  }),
  storage: freeStorage<SessionData>(token),
  getSessionKey: (ctx) =>
    ctx.from?.id
      ? `${ctx.from.id}:${ctx.callbackQuery?.inline_message_id}`
      : undefined,
}));

bot.callbackQuery(
  /all_contributors:(?<sender>[^:]+):(?<repo>.+)/,
  async (ctx, next) => {
    if (typeof ctx.match === "string") return next();

    const { sender, repo } = ctx.match.groups ?? {};

    if (!sender || !repo) {
      return ctx.answerCallbackQuery({
        text: "Missing sender or repo",
      });
    }

    ctx.session.allContributors.repo = repo;

    await ctx.editMessageReplyMarkup({
      reply_markup: emojiKeyboard([]),
    });
  },
);

bot.callbackQuery(/all_contributors:toggle:(?<key>.+)/, async (ctx, next) => {
  if (typeof ctx.match === "string") return next();

  const { key } = ctx.match.groups ?? {};

  if (!key) {
    return ctx.answerCallbackQuery({
      text: "Missing key",
    });
  }

  const selected = ctx.session.allContributors.keys;

  const isRemoving = selected.includes(key);

  const newSelected = isRemoving
    ? selected.filter((k) => k !== key)
    : selected.concat(key);

  ctx.session.allContributors.keys = newSelected;

  await ctx.editMessageReplyMarkup({
    reply_markup: emojiKeyboard(newSelected),
  });

  return ctx.answerCallbackQuery({
    text: `${isRemoving ? "Unselected" : "Selected"} ${key}`,
  });
});

bot.callbackQuery(/all_contributors:done/, async (ctx) => {
  const { sender, repo, keys } = ctx.session.allContributors;
  await ctx.editMessageReplyMarkup({
    reply_markup: { inline_keyboard: [] },
  });

  return ctx.answerCallbackQuery({
    text: `Adding ${keys.join(", ")} for ${sender} on ${repo}`,
  });
});
