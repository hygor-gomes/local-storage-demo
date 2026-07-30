import { createFileRoute } from "@tanstack/react-router";
import { RegistrationFlow } from "@/components/flow/registration-flow";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VemMimo — Novo fluxo de cadastro de serviços" },
      {
        name: "description",
        content:
          "Protótipo navegável do novo fluxo de cadastro de serviços do profissional: áreas de atuação, subserviços, catálogo e publicação.",
      },
      { property: "og:title", content: "VemMimo — Novo fluxo de cadastro de serviços" },
      {
        property: "og:description",
        content: "Protótipo em 4 etapas para montar o catálogo de serviços do profissional.",
      },
    ],
  }),
  component: RegistrationFlow,
});
