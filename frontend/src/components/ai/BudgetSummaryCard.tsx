export function BudgetSummaryCard({
  totalCost,
  channelCount,
}: {
  totalCost: number;
  channelCount: number;
}) {
  return (
    <div className="p-4 bg-white border border-border rounded-lg">
      <h3 className="text-sm font-medium text-primary mb-3">Расчёт бюджета</h3>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-secondary">Активных площадок</span>
        <span className="text-sm font-medium text-primary">{channelCount}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary">Общая стоимость</span>
        <span className="text-lg font-bold text-accent">
          {totalCost.toLocaleString("ru-RU")} ₽
        </span>
      </div>
      <p className="text-xs text-muted mt-3">
        Все данные демонстрационные. Расчёт основан на тестовых показателях каналов.
      </p>
    </div>
  );
}