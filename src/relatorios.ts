import { listarClientes } from "./clientes";
import { listarPedidos } from "./pedidos";
import { listarProdutos } from "./produtos";
import { Pedido, Produto } from "./types";
import { arredondar, formatarData, formatarMoeda } from "./utils";

export function calcularFaturamento(): number {
  return arredondar(listarPedidos().reduce((soma, p) => soma + p.total, 0));
}

// Produtos vendidos, do mais vendido para o menos vendido.
export function produtosMaisVendidos(): { nome: string; quantidade: number; receita: number }[] {
  const mapa = new Map<number, { nome: string; quantidade: number; receita: number }>();
  listarPedidos().forEach((pedido) =>
    pedido.itens.forEach((item) => {
      const atual = mapa.get(item.produtoId) ?? { nome: item.nome, quantidade: 0, receita: 0 };
      atual.quantidade += item.quantidade;
      atual.receita = arredondar(atual.receita + item.subtotal);
      mapa.set(item.produtoId, atual);
    })
  );
  return [...mapa.values()].sort((a, b) => b.quantidade - a.quantidade);
}

export function produtosComEstoqueBaixo(limite: number = 5): Produto[] {
  return listarProdutos().filter((p) => p.estoque <= limite);
}

export function imprimirPedido(pedido: Pedido): void {
  const cliente = listarClientes().find((c) => c.id === pedido.clienteId);
  console.log(`Pedido #${pedido.id} — ${cliente ? cliente.nome : "cliente " + pedido.clienteId} — ${formatarData(pedido.data)}`);
  pedido.itens.forEach((i) =>
    console.log(`  ${i.quantidade}x ${i.nome} @ ${formatarMoeda(i.precoUnitario)} = ${formatarMoeda(i.subtotal)}`)
  );
  console.log(`  TOTAL: ${formatarMoeda(pedido.total)}`);
}

export function imprimirRelatorioVendas(): void {
  const pedidos = listarPedidos();
  const faturamento = calcularFaturamento();

  console.log("--- Resumo de vendas ---");
  console.log(`Pedidos realizados: ${pedidos.length}`);
  console.log(`Faturamento total: ${formatarMoeda(faturamento)}`);
  if (pedidos.length > 0) {
    console.log(`Ticket médio: ${formatarMoeda(arredondar(faturamento / pedidos.length))}`);
  }

  console.log("\n--- Vendas por cliente ---");
  listarClientes().forEach((cliente) => {
    const doCliente = pedidos.filter((p) => p.clienteId === cliente.id);
    const total = arredondar(doCliente.reduce((soma, p) => soma + p.total, 0));
    console.log(`${cliente.nome}: ${doCliente.length} pedido(s), ${formatarMoeda(total)}`);
  });

  console.log("\n--- Produtos mais vendidos ---");
  produtosMaisVendidos().forEach((p, i) =>
    console.log(`${i + 1}. ${p.nome}: ${p.quantidade} un. (${formatarMoeda(p.receita)})`)
  );

  console.log("\n--- Estoque baixo (5 ou menos) ---");
  const baixos = produtosComEstoqueBaixo(5);
  if (baixos.length === 0) console.log("Nenhum produto com estoque baixo.");
  baixos.forEach((p) => console.log(`${p.nome}: ${p.estoque} un.`));
}
