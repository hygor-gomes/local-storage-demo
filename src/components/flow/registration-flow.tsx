import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, LogOut, Sparkles } from "lucide-react";
import { AREAS, areaById, subKey, subLabel } from "@/lib/catalog-data";
import { useCatalog } from "@/lib/use-catalog";
import { serviceTotals } from "@/lib/service-totals";

import { CheckBox, Hint, Stepper } from "@/components/flow/ui";
import { StepCatalog } from "@/components/flow/step-catalog";

const STEP_TITLES = [
  "ÁREAS DE ATUAÇÃO",
  "SUBSERVIÇOS",
  "MONTE SEU CATÁLOGO DE SERVIÇOS",
  "RESUMO E PUBLICAÇÃO",
];

export function RegistrationFlow() {
  const { state, update, reset, hydrated } = useCatalog();
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({});

  const step = state.step;
  const subsOfSelectedAreas = useMemo(
    () => state.subs.filter((s) => state.areas.includes(s.split("::")[0])),
    [state.subs, state.areas],
  );

  function toggleArea(id: string) {
    update((s) => {
      const on = s.areas.includes(id);
      return {
        areas: on ? s.areas.filter((a) => a !== id) : [...s.areas, id],
        subs: on ? s.subs.filter((k) => k.split("::")[0] !== id) : s.subs,
        services: on ? s.services.filter((sv) => sv.subKey.split("::")[0] !== id) : s.services,
      };
    });
  }

  function toggleSub(key: string) {
    update((s) => {
      const on = s.subs.includes(key);
      return {
        subs: on ? s.subs.filter((k) => k !== key) : [...s.subs, key],
        services: on ? s.services.filter((sv) => sv.subKey !== key) : s.services,
      };
    });
  }

  const canContinue =
    (step === 1 && state.areas.length > 0) ||
    (step === 2 && subsOfSelectedAreas.length > 0) ||
    (step === 3 && state.services.length > 0);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-md bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground">
            ETAPA {step}
          </span>
          <h1 className="text-sm tracking-wide text-muted-foreground">{STEP_TITLES[step - 1]}</h1>
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Sair <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="card-panel p-5 sm:p-7">
          <p className="font-display text-2xl tracking-wide">VemMimo</p>
          <div className="my-6">
            <Stepper current={step} />
          </div>

          {step === 1 && (
            <section>
              <h2 className="font-display text-2xl">1. Em quais áreas você trabalha?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecione todas as opções que se aplicam ao seu trabalho.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {AREAS.map((a) => {
                  const on = state.areas.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleArea(a.id)}
                      className={[
                        "flex items-center justify-between gap-2 rounded-lg border bg-surface px-4 py-4 text-left text-sm transition-colors",
                        on ? "border-primary" : "border-border hover:border-muted-foreground",
                      ].join(" ")}
                    >
                      {a.name}
                      <CheckBox checked={on} />
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                {state.areas.length} área{state.areas.length === 1 ? "" : "s"} selecionada
                {state.areas.length === 1 ? "" : "s"}
              </p>
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl">2. Quais subserviços você oferece?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Escolha os tipos de serviços que você realiza em cada área selecionada.
                  </p>
                </div>
                <span className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground">
                  {state.areas.length} áreas selecionadas
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {state.areas.map((id) => {
                  const area = areaById(id)!;
                  const collapsed = openAreas[id] === false;
                  const count = area.subservices.filter((s) =>
                    state.subs.includes(subKey(id, s)),
                  ).length;
                  return (
                    <div key={id} className="rounded-xl border border-border bg-surface p-4">
                      <button
                        onClick={() => setOpenAreas((o) => ({ ...o, [id]: collapsed }))}
                        className="flex w-full items-center justify-between gap-2"
                      >
                        <span className="font-display text-lg">{area.name}</span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          {count} selecionado{count === 1 ? "" : "s"}
                          {collapsed ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                      {!collapsed && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {area.subservices.map((s) => {
                            const key = subKey(id, s);
                            const on = state.subs.includes(key);
                            return (
                              <button
                                key={key}
                                onClick={() => toggleSub(key)}
                                className={[
                                  "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs",
                                  on
                                    ? "border-primary text-foreground"
                                    : "border-border text-muted-foreground hover:border-muted-foreground",
                                ].join(" ")}
                              >
                                {s}
                                <CheckBox checked={on} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {step === 3 && (
            <StepCatalog
              subs={subsOfSelectedAreas}
              services={state.services}
              onChange={(services) => update({ services })}
            />
          )}

          {step === 4 && (
            <section>
              <h2 className="font-display text-2xl">4. Revise seu catálogo e publique seu perfil</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Confira um resumo dos seus serviços e publique seu perfil para atrair clientes.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  [state.areas.length, "Áreas de atuação"],
                  [subsOfSelectedAreas.length, "Subserviços selecionados"],
                  [state.services.length, "Serviços cadastrados"],
                ].map(([v, l]) => (
                  <div key={l as string} className="rounded-xl border border-border bg-surface p-5 text-center">
                    <p className="font-display text-3xl">{v as number}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{l as string}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-primary bg-surface p-5 text-center">
                  <p className="font-display text-3xl text-primary">100%</p>
                  <p className="mt-1 text-xs text-muted-foreground">Cadastro completo</p>
                  <p className="text-xs text-accent">Parabéns!</p>
                </div>
              </div>

              <p className="mt-6 text-sm font-medium">Resumo do seu catálogo</p>
              <div className="mt-2 space-y-2">
                {state.areas.map((id) => {
                  const area = areaById(id)!;
                  const subs = subsOfSelectedAreas.filter((k) => k.startsWith(`${id}::`));
                  const svc = state.services.filter((s) => s.subKey.startsWith(`${id}::`));
                  return (
                    <details key={id} className="rounded-lg border border-border bg-surface px-4 py-3">
                      <summary className="flex cursor-pointer items-center justify-between text-sm">
                        <span>{area.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {subs.length} subserviços • {svc.length} serviços
                        </span>
                      </summary>
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {svc.map((s) => (
                          <li key={s.id} className="flex justify-between gap-2">
                            <span>
                              {subLabel(s.subKey)} — {s.name}
                            </span>
                            <span className="shrink-0">
                              {serviceTotals(s).duration} • {serviceTotals(s).priceLabel}
                            </span>
                          </li>

                        ))}
                        {svc.length === 0 && <li>Nenhum serviço cadastrado nesta área.</li>}
                      </ul>
                    </details>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div className="text-sm">
                  <p className="font-medium">
                    {state.published
                      ? "Perfil publicado com sucesso!"
                      : "Seu perfil está pronto para ser publicado!"}
                  </p>
                  <p className="text-muted-foreground">
                    Revise as informações e, se necessário, volte às etapas anteriores para fazer
                    ajustes.
                  </p>
                </div>
              </div>
            </section>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <button
              onClick={() => update({ step: Math.max(1, step - 1) })}
              disabled={step === 1}
              className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <div className="flex flex-wrap items-center gap-3">
              {step > 1 && (
                <span className="text-xs text-muted-foreground">
                  Salvo automaticamente no navegador
                </span>
              )}
              {step < 4 ? (
                <button
                  onClick={() => update({ step: step + 1 })}
                  disabled={!canContinue}
                  className="btn-gold flex items-center gap-2 px-5 py-2 text-sm"
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => update({ published: true })}
                  className="btn-gold flex items-center gap-2 px-5 py-2 text-sm"
                >
                  Publicar meu perfil <Sparkles className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <Hint>
          {step === 1 && "Você poderá ajustar essas informações depois."}
          {step === 2 && "Você poderá incluir novos subserviços depois, se desejar."}
          {step === 3 && "Você pode adicionar quantos serviços quiser em cada subserviço."}
          {step === 4 &&
            "Você poderá editar ou adicionar serviços depois que seu perfil estiver no ar."}
        </Hint>
      </div>
    </main>
  );
}
