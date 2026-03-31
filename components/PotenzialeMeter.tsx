interface Props {
  punteggio: number // 1 to 5
}

export function PotenzialeMeter({ punteggio }: Props) {
  return (
    <div className="flex gap-2 items-center">
      {[1, 2, 3, 4, 5].map((level) => (
        <span
          key={level}
          className={`w-4 h-4 rounded-full border border-terracotta ${
            level <= punteggio ? "bg-terracotta" : "bg-transparent"
          }`}
          title={`Potenziale ${level} di 5`}
        />
      ))}
      <span className="text-xl font-bold font-serif text-ink ml-2">
        {punteggio}/5
      </span>
    </div>
  )
}
