export function QuickPrompts({
  onSelectPrompt,
}: {
  onSelectPrompt: (text: string) => void;
}) {
  const prompts = [
    "Подбери каналы про технологии с бюджетом до 30 000 рублей",
    "Сколько стоит реклама на выбранных площадках?",
    "Помоги создать рекламную кампанию",
    "Какие кампании у меня есть?",
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {prompts.map((prompt, i) => (
        <button
          key={i}
          onClick={() => onSelectPrompt(prompt)}
          className="px-3 py-2 text-xs text-secondary bg-secondary border border-border rounded-md hover:bg-accent hover:text-white hover:border-accent transition whitespace-normal text-left max-w-[240px]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}