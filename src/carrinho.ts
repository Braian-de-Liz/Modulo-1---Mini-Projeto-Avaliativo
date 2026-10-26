import { buscarClientePorId } from "./clientes";
import { buscarProdutoPorId } from "./produtos";
import { Carrinho, ItemCarrinho, ItemDetalhado } from "./types";
import { arredondar } from "./utils";

// Um carrinho por cliente, criado sob demanda.
const carrinhos: Carrinho[] = [];

function obterCarrinho(clienteId: number): Carrinho {
  if (!buscarClientePorId(clienteId)) {
    throw new Error(`Cliente ${clienteId} não encontrado.`);
  }
  let carrinho = carrinhos.find((c) => c.clienteId === clienteId);
  if (!carrinho) {
    carrinho = { clienteId, itens: [] };
    carrinhos.push(carrinho);
  }
  return carrinho;
}

function validarQuantidade(quantidade: number): void {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error("A quantidade deve ser um número inteiro maior que zero.");
  }
}

export function adicionarAoCarrinho(
  clienteId: number,
  produtoId: number,
  quantidade: number
): ItemCarrinho {
  validarQuantidade(quantidade);
  const carrinho = obterCarrinho(clienteId);

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) {
    throw new Error(`Produto ${produtoId} não existe.`);
  }

  // Se o produto já está no carrinho, soma a quantidade (sem linhas duplicadas).
  const existente = carrinho.itens.find((i) => i.produtoId === produtoId);
  const novaQuantidade = (existente ? existente.quantidade : 0) + quantidade;

  if (novaQuantidade > produto.estoque) {
    throw new Error(
      `Quantidade indisponível para "${produto.nome}": pedido ${novaQuantidade}, estoque ${produto.estoque}.`
    );
  }

  if (existente) {
    existente.quantidade = novaQuantidade;
    return { ...existente };
  }
  const novoItem: ItemCarrinho = { produtoId, quantidade };
  carrinho.itens.push(novoItem);
  return { ...novoItem };
}

export function removerDoCarrinho(clienteId: number, produtoId: number): void {
  const carrinho = obterCarrinho(clienteId);
  if (!carrinho.itens.some((i) => i.produtoId === produtoId)) {
    throw new Error(`O produto ${produtoId} não está no carrinho.`);
  }
  carrinho.itens = carrinho.itens.filter((i) => i.produtoId !== produtoId);
}

// Define a nova quantidade (não soma): útil para "trocar 2 por 5".
export function alterarQuantidade(
  clienteId: number,
  produtoId: number,
  novaQuantidade: number
): ItemCarrinho {
  validarQuantidade(novaQuantidade);
  const carrinho = obterCarrinho(clienteId);

  const item = carrinho.itens.find((i) => i.produtoId === produtoId);
  if (!item) {
    throw new Error(`O produto ${produtoId} não está no carrinho.`);
  }
  const produto = buscarProdutoPorId(produtoId);
  if (!produto) {
    throw new Error(`Produto ${produtoId} não existe.`);
  }
  if (novaQuantidade > produto.estoque) {
    throw new Error(
      `Quantidade indisponível para "${produto.nome}": pedido ${novaQuantidade}, estoque ${produto.estoque}.`
    );
  }
  item.quantidade = novaQuantidade;
  return { ...item };
}

// Lista os itens já com nome, preço unitário e subtotal (preço × quantidade).
export function listarItensCarrinho(clienteId: number): ItemDetalhado[] {
  const carrinho = obterCarrinho(clienteId);
  return carrinho.itens.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (!produto) {
      throw new Error(`Produto ${item.produtoId} do carrinho não existe mais.`);
    }
    return {
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      nome: produto.nome,
      precoUnitario: produto.preco,
      subtotal: calcularSubtotal(produto.preco, item.quantidade),
    };
  });
}

export function calcularSubtotal(precoUnitario: number, quantidade: number): number {
  return arredondar(precoUnitario * quantidade);
}

// Total = soma dos subtotais.
export function calcularTotal(clienteId: number): number {
  const total = listarItensCarrinho(clienteId).reduce((soma, i) => soma + i.subtotal, 0);
  return arredondar(total);
}

export function limparCarrinho(clienteId: number): void {
  obterCarrinho(clienteId).itens = [];
}

// Chamada quando um produto é removido do catálogo, para não deixar itens "órfãos".
export function removerProdutoDeTodosCarrinhos(produtoId: number): void {
  carrinhos.forEach((c) => {
    c.itens = c.itens.filter((i) => i.produtoId !== produtoId);
  });
}
