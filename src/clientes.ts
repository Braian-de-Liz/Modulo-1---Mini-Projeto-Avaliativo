import { Cliente } from "./types";

//Pelo menos 3 clientes iniciais para facilitar os testes.

const clientes: Cliente[] = [
  { id: 1, nome: "Ana Souza", email: "ana.souza@email.com" },
  { id: 2, nome: "Bruno Lima", email: "bruno.lima@email.com" },
  { id: 3, nome: "Carla Mendes", email: "carla.mendes@email.com" },
];

export function cadastrarCliente(cliente: Cliente): Cliente {
  if (!Number.isInteger(cliente.id) || cliente.id <= 0) {
    throw new Error("O id do cliente deve ser um número inteiro positivo.");
  }
  if (typeof cliente.nome !== "string" || cliente.nome.trim() === "") {
    throw new Error("O nome do cliente é obrigátorio.");
  }
  if (typeof cliente.email !== "string" || cliente.email.trim() === "") {
    throw new Error("O e-mail do cliente é obrigatório.");
  }

  const email = cliente.email.trim().toLowerCase();

  // Validação simples de formato do email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("O e-mail informado não é válido.");
  }
  if (clientes.some((c) => c.id === cliente.id)) {
    throw new Error(`Já existe um cliente com o id ${cliente.id}.`);
  }
  if (clientes.some((c) => c.email.toLowerCase() === email)) {
    throw new Error(`Já existe um cliente com o e-mail ${email}.`);
  }

  const novo: Cliente = { id: cliente.id, nome: cliente.nome.trim(), email };
  clientes.push(novo);
  return { ...novo };
}

export function listarClientes(): Cliente[] {
  return clientes.map((c) => ({ ...c }));
}

export function buscarClientePorId(id: number): Cliente | undefined {
  const cliente = clientes.find((c) => c.id === id);
  return cliente ? { ...cliente } : undefined;
}
