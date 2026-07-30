export type Area = {
  id: string;
  name: string;
  subservices: string[];
};

export const AREAS: Area[] = [
  {
    id: "cabelos",
    name: "Cabelos",
    subservices: [
      "Escova",
      "Hidratação",
      "Progressiva",
      "Coloração",
      "Corte",
      "Penteado",
      "Luzes",
    ],
  },
  {
    id: "maquiagem",
    name: "Maquiagem",
    subservices: [
      "Maquiagem Social",
      "Noiva",
      "Festa",
      "Artística",
      "Editorial",
      "Infantil",
    ],
  },
  {
    id: "unhas",
    name: "Unhas",
    subservices: [
      "Manicure",
      "Pedicure",
      "Esmaltação em gel",
      "Alongamento",
      "Blindagem",
    ],
  },
  {
    id: "estetica-facial",
    name: "Estética Facial",
    subservices: [
      "Limpeza de pele",
      "Peeling",
      "Microagulhamento",
      "Radiofrequência",
llll    ],
  },
  {
    id: "massagem",
    name: "Massagem & Corpo",
    subservices: ["Relaxante", "Drenagem linfática", "Modeladora", "Pedras quentes"],
  },
  {
    id: "depilacao",
    name: "Depilação",
    subservices: ["Cera quente", "Laser", "Egípcia", "Linha"],
  },
  {
    id: "barbearia",
    name: "Barbearia",
    subservices: ["Corte masculino", "Barba", "Pigmentação", "Acabamento"],
  },
  {
    id: "cilios",
    name: "Cílios & Sobrancelhas",
    subservices: ["Extensão de cílios", "Lash lifting", "Design de sobrancelhas", "Henna"],
  },
  {
    id: "personal",
    name: "Personal Trainer",
    subservices: ["Treino funcional", "Musculação", "Avaliação física"],
  },
  {
    id: "servico-teste",
    name: "Serviço teste",
    subservices: ["Teste A", "Teste B"],
  },
  {
    id: "outros",
    name: "Outros",
    subservices: ["Serviço personalizado"],
  },
];

export const DURATIONS = [
  "15min",
  "30min",
  "45min",
  "1h",
  "1h 30min",
  "2h",
  "2h 30min",
  "3h",
  "4h",
];

export const INTERVALS = ["Sem intervalo", "5 min", "10 min", "15 min", "20 min", "30 min"];

export function subKey(areaId: string, sub: string) {
  return `${areaId}::${sub}`;
}

export function subLabel(key: string) {
  return key.split("::")[1] ?? key;
}

export function areaOfSub(key: string) {
  return key.split("::")[0];
}

export function areaById(id: string) {
  return AREAS.find((a) => a.id === id);
}
