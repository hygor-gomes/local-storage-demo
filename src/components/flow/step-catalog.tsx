import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Eye } from "lucide-react";
import { DURATIONS, INTERVALS, subLabel } from "@/lib/catalog-data";
import type { CustomExtra, Service } from "@/lib/use-catalog";
import { serviceTotals } from "@/lib/service-totals";
import { Field, inputClass } from "./ui";

type Props = {
  subs: string[];
  services: Service[];
  onChange: (services: Service[]) => void;
};

function blank(subKey: string, id: string): Service {
  return {
    id,
    subKey,
    name: "",
    duration: "1h",
    price: "",
    description: "",
    atSalon: true,
    atHome: false,
    extras: [],
    customExtras: [],
    interval: "Sem intervalo",
  };
}


export function StepCatalog({ subs, services, onChange }: Props) {
  const [openSub, setOpenSub] = useState<string | null>(subs[0] ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Service | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (openSub && !subs.includes(openSub)) setOpenSub(subs[0] ?? null);
  }, [subs, openSub]);

  const bySub = useMemo(() => {
    const map: Record<string, Service[]> = {};
    subs.forEach((s) => (map[s] = []));
    services.forEach((sv) => {
      (map[sv.subKey] ??= []).push(sv);
    });
    return map;
  }, [subs, services]);

  function startNew(sub: string) {
    const s = blank(sub, crypto.randomUUID());
    setDraft(s);
    setEditingId(s.id);
    setOpenSub(sub);
  }

  function startEdit(s: Service) {
    setDraft({ ...s });
    setEditingId(s.id);
  }

  function save() {
    if (!draft || !draft.name.trim()) return;
    const exists = services.some((s) => s.id === draft.id);
    onChange(exists ? services.map((s) => (s.id === draft.id ? draft : s)) : [...services, draft]);
    setDraft(null);
    setEditingId(null);
  }

  function remove(id: string) {
    onChange(services.filter((s) => s.id !== id));
    if (editingId === id) {
      setDraft(null);
      setEditingId(null);
    }
  }

  const extrasOptions = subs.filter((s) => s !== draft?.subKey).map(subLabel);

  const editorBody = (
    <>
            {!draft ? (
              <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <p>Selecione um serviço na lista ou crie um novo para configurá-lo.</p>
                {subs[0] && (
                  <button onClick={() => startNew(openSub ?? subs[0])} className="btn-gold px-4 py-2 text-sm">
                    + Adicionar serviço
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    Editando: {draft.name || "Novo serviço"}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {subLabel(draft.subKey)}
                    </span>
                  </p>
                  <button
                    onClick={() => remove(draft.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Excluir serviço"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Nome do serviço" required>
                    <input
                      className={inputClass}
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Ex.: Escova Tradicional"
                    />
                  </Field>
                  <Field label="Duração" required>
                    <select
                      className={inputClass}
                      value={draft.duration}
                      onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Preço" required>
                    <input
                      className={inputClass}
                      value={draft.price}
                      onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                      placeholder="R$ 120,00"
                    />
                  </Field>
                </div>

                <Field label="Descrição (opcional)">
                  <textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    maxLength={300}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    placeholder="Descreva o que está incluso neste serviço, diferenciais e recomendações."
                  />
                  <span className="self-end text-xs text-muted-foreground">
                    {draft.description.length}/300
                  </span>
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Atendimento" required>
                    <div className="flex gap-2">
                      {(
                        [
                          ["No salão", "atSalon"],
                          ["A domicílio", "atHome"],
                        ] as const
                      ).map(([label, key]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDraft({ ...draft, [key]: !draft[key] })}
                          className={[
                            "rounded-md border px-3 py-2 text-xs",
                            draft[key]
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Precisa de intervalo?">
                    <select
                      className={inputClass}
                      value={draft.interval}
                      onChange={(e) => setDraft({ ...draft, interval: e.target.value })}
                    >
                      {INTERVALS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Serviços adicionais (opcional)">
                  <div className="flex flex-wrap gap-2">
                    {extrasOptions.map((label) => {
                      const on = draft.extras.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              extras: on
                                ? draft.extras.filter((e) => e !== label)
                                : [...draft.extras, label],
                            })
                          }
                          className={[
                            "rounded-full border px-3 py-1 text-xs",
                            on
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setDraft(null);
                      setEditingId(null);
                    }}
                    className="btn-ghost px-4 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                  <button onClick={save} disabled={!draft.name.trim()} className="btn-gold px-4 py-2 text-sm">
                    Salvar serviço
                  </button>
                </div>
              </div>
            )}
    </>
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">3. Monte seu catálogo de serviços</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie, nomeie e configure todos os serviços que você oferece.
          </p>
        </div>
        <button
          onClick={() => setPreview((p) => !p)}
          className="btn-ghost flex items-center gap-2 px-3 py-1.5 text-xs"
        >
          <Eye className="h-3.5 w-3.5" />
          {preview ? "Voltar à edição" : "Ver como cliente verá"}
        </button>
      </div>

      {preview ? (
        <div className="mt-5 space-y-4">
          {subs.map((sub) => (
            <div key={sub} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-display text-lg">{subLabel(sub)}</p>
              <ul className="mt-2 space-y-2">
                {(bySub[sub] ?? []).map((s) => (
                  <li key={s.id} className="flex justify-between border-b border-border/60 pb-2 text-sm">
                    <span>
                      {s.name}
                      <span className="ml-2 text-xs text-muted-foreground">{s.duration}</span>
                    </span>
                    <span className="text-primary">{s.price || "—"}</span>
                  </li>
                ))}
                {(bySub[sub] ?? []).length === 0 && (
                  <li className="text-sm text-muted-foreground">Nenhum serviço cadastrado.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-[290px_1fr]">
          <div className="rounded-xl border border-border bg-surface p-2">
            {subs.map((sub) => {
              const list = bySub[sub] ?? [];
              const open = openSub === sub;
              return (
                <div key={sub} className="border-b border-border/60 last:border-0">
                  <button
                    onClick={() => setOpenSub(open ? null : sub)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                  >
                    <span>
                      <span className="block text-sm font-medium">{subLabel(sub)}</span>
                      <span className="block text-xs text-muted-foreground">
                        {list.length} serviço{list.length === 1 ? "" : "s"} cadastrado
                        {list.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    {open ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {open && (
                    <div className="pb-2">
                      {list.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => startEdit(s)}
                          className={[
                            "block w-full rounded-md px-3 py-2 text-left text-sm",
                            editingId === s.id
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted/60",
                          ].join(" ")}
                        >
                          {s.name || "Sem nome"}
                        </button>
                      ))}
                      <button
                        onClick={() => startNew(sub)}
                        className="btn-ghost mt-2 flex w-full items-center justify-center gap-1.5 px-3 py-2 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5" /> Adicionar serviço
                      </button>
                      {draft && draft.subKey === sub && (
                        <div className="mt-3 rounded-xl border border-border bg-background p-3 lg:hidden">
                          {editorBody}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden rounded-xl border border-border bg-surface p-4 lg:block">
            {editorBody}
          </div>
        </div>
      )}
    </div>
  );
}
