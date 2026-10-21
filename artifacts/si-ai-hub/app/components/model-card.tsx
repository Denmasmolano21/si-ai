import { Code2 } from "lucide-react";
import type { AIModel } from "@/config/models";

type ModelCardProps = {
  model: AIModel;
  selected: boolean;
  onSelect: (modelId: string) => void;
};

function pricingLabel(status: AIModel["pricingStatus"]) {
  if (status === "free") return "Gratis";
  if (status === "paid") return "Berbayar";
  return "Harga belum diverifikasi";
}

export function ModelCard({ model, selected, onSelect }: ModelCardProps) {
  return (
    <button
      type="button"
      className={`model-status-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(model.id)}
      disabled={!model.enabled}
      aria-pressed={selected}
      aria-label={`Pilih ${model.name} dari ${model.provider}. ${pricingLabel(model.pricingStatus)}.`}
      data-testid={`model-card-${model.id.replaceAll("/", "-")}`}
    >
      <span className="model-card-mark">
        <Code2 size={15} />
      </span>
      <span className="model-card-copy">
        <strong>{model.name}</strong>
        <small>{model.provider}</small>
      </span>
      <span className="price-status">{pricingLabel(model.pricingStatus)}</span>
    </button>
  );
}
