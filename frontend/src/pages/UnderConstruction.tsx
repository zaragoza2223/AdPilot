import { useParams } from "react-router";
import { AlertCircle } from "lucide-react";

interface UnderConstructionProps {
  sectionName: string;
}

export function UnderConstruction({ sectionName }: UnderConstructionProps) {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Раздел «{sectionName}» в разработке
      </h2>
      <p className="text-secondary text-lg max-w-md mx-auto mb-8">
        Страница находится в стадии реализации. Скоро здесь появится полноценный интерфейс.
      </p>
      {id && (
        <p className="text-sm text-muted">
          ID кампании: <span className="text-primary font-mono">{id}</span>
        </p>
      )}
    </div>
  );
}