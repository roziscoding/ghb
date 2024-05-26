import { InlineKeyboard } from "./deps.ts";
import { chunk } from "std/collections/chunk.ts";

const EMOJI_KEY = [
  { emoji: "🔊", type: "audio", label: "Audio" },
  { emoji: "♿️", type: "a11y", label: "Accessibility" },
  { emoji: "🐛", type: "bug", label: "Bug reports" },
  { emoji: "📝", type: "blog", label: "Blogposts" },
  { emoji: "💼", type: "business", label: "Business Development" },
  { emoji: "💻", type: "code", label: "Code" },
  { emoji: "🖋", type: "content", label: "Content" },
  { emoji: "🔣", type: "data", label: "Data" },
  { emoji: "📖", type: "doc", label: "Documentation" },
  { emoji: "🎨", type: "design", label: "Design" },
  { emoji: "💡", type: "example", label: "Examples" },
  { emoji: "📋", type: "eventOrganizing", label: "Event Organizers" },
  { emoji: "💵", type: "financial", label: "Financial Support" },
  { emoji: "🔍", type: "fundingFinding", label: "Funding/Grant Finders" },
  { emoji: "🤔", type: "ideas", label: "Ideas & Planning" },
  { emoji: "🚇", type: "infra", label: "Infrastructure" },
  { emoji: "🚧", type: "maintenance", label: "Maintenance" },
  { emoji: "🧑‍🏫", type: "mentoring", label: "Mentoring" },
  { emoji: "📦", type: "platform", label: "Packaging" },
  { emoji: "🔌", type: "plugin", label: "Plugin/utility libraries" },
  { emoji: "📆", type: "projectManagement", label: "Project Management" },
  { emoji: "📣", type: "promotion", label: "Promotion" },
  { emoji: "💬", type: "question", label: "Answering Questions" },
  { emoji: "🔬", type: "research", label: "Research" },
  { emoji: "👀", type: "review", label: "Reviewed Pull Requests" },
  { emoji: "🛡️", type: "security", label: "Security" },
  { emoji: "🔧", type: "tool", label: "Tools" },
  { emoji: "🌍", type: "translation", label: "Translation" },
  { emoji: "⚠️", type: "test", label: "Tests" },
  { emoji: "✅", type: "tutorial", label: "Tutorials" },
  { emoji: "📢", type: "talk", label: "Talks" },
  { emoji: "📓", type: "userTesting", label: "User Testing" },
  { emoji: "📹", type: "video", label: "Videos" },
];

const rows = chunk(EMOJI_KEY, 3);

export const emojiKeyboard = (selected: string[]) =>
  InlineKeyboard.from(
    [
      ...rows.map((row) =>
        row.map((item) =>
          InlineKeyboard.text(
            `${selected.includes(item.type) ? "* " : ""}${item.emoji}`,
            `all_contributors:toggle:${item.type}`,
          )
        )
      ),
      [InlineKeyboard.text("Done", `all_contributors:done`)],
    ],
  );

export const addContributionsButton = (sender: string, repo: string | null) =>
  repo
    ? new InlineKeyboard().text(
      "Add Contribution Badges",
      `all_contributors:${sender}:${repo}`,
    )
    : undefined;
