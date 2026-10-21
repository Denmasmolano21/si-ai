import { randomUUID } from "node:crypto";
import { AI_MODELS } from "@/config/models";
import { z } from "zod";

export const runtime = "nodejs";

const chatRequestSchema = z
  .object({
    prompt: z.string().trim().min(1, "Pesan tidak boleh kosong.").max(
      4000,
      "Pesan maksimal 4.000 karakter.",
    ),
    modelId: z.string().trim().min(1),
    conversationId: z.string().trim().min(1).max(128).optional(),
  })
  .strict();

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Format permintaan tidak valid.", 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues[0]?.message ?? "Periksa kembali pesan kamu.",
      400,
    );
  }

  const model = AI_MODELS.find(
    (candidate) =>
      candidate.id === parsed.data.modelId && candidate.enabled,
  );
  if (!model) {
    return errorResponse("Model tersebut belum tersedia di katalog demo.", 400);
  }

  const promptPreview = parsed.data.prompt.replace(/\s+/g, " ").slice(0, 180);
  const reply = [
    "Ini adalah balasan contoh dari mode demo, bukan hasil dari model AI.",
    "OpenRouter belum dihubungkan, jadi prompt ini tidak dikirim ke penyedia mana pun.",
    `Model yang dipilih di UI: ${model.name} (${model.provider}).`,
    `Prompt contoh: “${promptPreview}${parsed.data.prompt.length > 180 ? "…" : ""}”`,
  ].join("\n\n");

  return Response.json({
    mode: "demo",
    reply,
    conversationId: parsed.data.conversationId ?? randomUUID(),
  });
}
