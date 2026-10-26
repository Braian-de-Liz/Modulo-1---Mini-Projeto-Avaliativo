import { DadosProduto, Produto } from "./types";

// Catálogo inicial (os dados ficam em memória durante a execução).
const produtos: Produto[] = [
  { id: 1, nome: "Teclado Mecânico", categoria: "Periféricos", preco: 250, estoque: 10 },
  { id: 2, nome: "Mouse Gamer", categoria: "Periféricos", preco: 120.5, estoque: 15 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "Monitores", preco: 899.9, estoque: 5 },
  { id: 4, nome: "Headset USB", categoria: "Áudio", preco: 180, estoque: 8 },
  { id: 5, nome: "Webcam Full HD", categoria: "Periféricos", preco: 210, estoque: 6 },
  { id: 6, nome: "Cabo HDMI 2m", categoria: "Acessórios", preco: 29.9, estoque: 50 },
];

// Valida as regras de negócio de um produto (usado no cadastro e na atualização).
function validarDados(dados: DadosProduto): void {
  if (typeof dados.nome !== "string" || dados.nome.trim() === "") {
    throw new Error("O nome do produto não pode estar vazio.");
  }
  if (typeof dados.categoria !== "string" || dados.categoria.trim() === "") {
    throw new Error("A categoria do produto não pode estar vazia.");
  }
  if (!Number.isFinite(dados.preco) || dados.preco <= 0) {
    throw new Error("O preço do produto deve ser maior que zero.");
  }
  if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
    throw new Error("O estoque do produto não pode ser negativo (e deve ser inteiro).");
  }
}

export function cadastrarProduto(produto: Produto): Produto {
  if (!Number.isInteger(produto.id) || produto.id <= 0) {
    throw new Error("O id do produto deve ser um número inteiro positivo.");
  }
  if (produtos.some((p) => p.id === produto.id)) {
    throw new Error(`Já existe um produto com o id ${produto.id}.`);
  }
  validarDados(produto);

  const novo: Produto = {
    ...produto,
    nome: produto.nome.trim(),
    categoria: produto.categoria.trim(),
  };
  produtos.push(novo);
  return { ...novo };
}

// Retorna cópias para que código externo não altere o catálogo sem passar pelas validações.
export function listarProdutos(): Produto[] {
  return produtos.map((p) => ({ ...p }));
}

export function buscarProdutoPorId(id: number): Produto | undefined {
  const produto = produtos.find((p) => p.id === id);
  return produto ? { ...produto } : undefined;
}

// Busca parcial e sem diferenciar maiúsculas/minúsculas: "tecl" encontra "Teclado Mecânico".
export function buscarProdutosPorNome(termo: string): Produto[] {
  const busca = termo.trim().toLowerCase();
  return produtos
    .filter((p) => p.nome.toLowerCase().includes(busca))
    .map((p) => ({ ...p }));
}

export function filtrarPorCategoria(categoria: string): Produto[] {
  const alvo = categoria.trim().toLowerCase();
  return produtos
    .filter((p) => p.categoria.toLowerCase() === alvo)
    .map((p) => ({ ...p }));
}

export function atualizarProduto(id: number, dados: Partial<DadosProduto>): Produto {
  const indice = produtos.findIndex((p) => p.id === id);
  if (indice === -1) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  // Monta o produto já atualizado e valida ANTES de gravar.
  const atualizado: Produto = { ...produtos[indice], ...dados, id };
  validarDados(atualizado);
  atualizado.nome = atualizado.nome.trim();
  atualizado.categoria = atualizado.categoria.trim();

  produtos[indice] = atualizado;
  return { ...atualizado };
}

// Regra do sistema: um produto que já foi vendido não pode ser removido
// (preserva o histórico). A verificação é recebida por parâmetro para este
// módulo não depender do módulo de pedidos.
export function removerProduto(
  id: number,
  produtoJaVendido: (produtoId: number) => boolean = () => false
): Produto {
  const indice = produtos.findIndex((p) => p.id === id);
  if (indice === -1) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  if (produtoJaVendido(id)) {
    throw new Error(`O produto ${id} já foi vendido e não pode ser removido.`);
  }
  const [removido] = produtos.splice(indice, 1);
  return removido;
}

// Usada pelo módulo de pedidos após uma venda confirmada.
export function baixarEstoque(id: number, quantidade: number): void {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  if (quantidade > produto.estoque) {
    throw new Error(`Estoque insuficiente para o produto ${id}.`);
  }
  produto.estoque -= quantidade;
}
