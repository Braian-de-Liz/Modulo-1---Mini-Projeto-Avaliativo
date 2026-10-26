import {
  adicionarAoCarrinho, alterarQuantidade, calcularTotal,
  listarItensCarrinho, removerDoCarrinho,
} from "./carrinho";
import { buscarClientePorId, cadastrarCliente, listarClientes } from "./clientes";
import { finalizarPedido, listarPedidos, listarPedidosDoCliente, removerProdutoDoCatalogo } from "./pedidos";
import {
  atualizarProduto, buscarProdutoPorId, buscarProdutosPorNome,
  cadastrarProduto, filtrarPorCategoria, listarProdutos,
} from "./produtos";
import { imprimirPedido, imprimirRelatorioVendas } from "./relatorios";
import { Produto } from "./types";
import { formatarMoeda } from "./utils";

function titulo(texto: string): void {
  console.log(`\n==================== ${texto} ====================`);
}

function imprimirProdutos(lista: Produto[]): void {
  if (lista.length === 0) console.log("  (nenhum produto encontrado)");
  lista.forEach((p) =>
    console.log(`  [${p.id}] ${p.nome} | ${p.categoria} | ${formatarMoeda(p.preco)} | estoque: ${p.estoque}`)
  );
}

function imprimirCarrinho(clienteId: number): void {
  const itens = listarItensCarrinho(clienteId);
  if (itens.length === 0) console.log("  (carrinho vazio)");
  itens.forEach((i) =>
    console.log(`  ${i.quantidade}x ${i.nome} @ ${formatarMoeda(i.precoUnitario)} = ${formatarMoeda(i.subtotal)}`)
  );
  console.log(`  Total do carrinho: ${formatarMoeda(calcularTotal(clienteId))}`);
}

// Executa uma operação que DEVE falhar e mostra o erro capturado.
function testarInvalido(descricao: string, operacao: () => unknown): void {
  try {
    operacao();
    console.log(`  ✗ FALHA NO TESTE: "${descricao}" deveria ter sido rejeitado!`);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.log(`  ✓ ${descricao} -> rejeitado: ${mensagem}`);
  }
}

// ---------------------------------------------------------------
titulo("1. PRODUTOS");
console.log("Todos os produtos:");
imprimirProdutos(listarProdutos());

console.log("\nBuscar por id (3):");
console.log(" ", buscarProdutoPorId(3));

console.log("\nBuscar por nome ('mec'):");
imprimirProdutos(buscarProdutosPorNome("mec"));

console.log("\nFiltrar por categoria ('Periféricos'):");
imprimirProdutos(filtrarPorCategoria("Periféricos"));

console.log("\nCadastrar novo produto (id 7):");
const novoProduto = cadastrarProduto({ id: 7, nome: "SSD 480GB", categoria: "Armazenamento", preco: 289.9, estoque: 12 });
console.log(" ", novoProduto);

console.log("\nAtualizar produto 6 (preço 29.9 -> 34.9):");
console.log(" ", atualizarProduto(6, { preco: 34.9 }));

console.log("\nRemover produto 5 (nunca vendido):");
console.log("  Removido:", removerProdutoDoCatalogo(5).nome);

// ---------------------------------------------------------------
titulo("2. CLIENTES");
console.log("Cadastrar cliente novo:");
console.log(" ", cadastrarCliente({ id: 4, nome: "Diego Rocha", email: "diego.rocha@email.com" }));
console.log("\nClientes cadastrados:");
listarClientes().forEach((c) => console.log(`  [${c.id}] ${c.nome} <${c.email}>`));
console.log("\nBuscar cliente 2:", buscarClientePorId(2));

// ---------------------------------------------------------------
titulo("3. CARRINHO (cliente 1 - Ana)");
adicionarAoCarrinho(1, 1, 2); // 2 teclados
adicionarAoCarrinho(1, 2, 1); // 1 mouse
adicionarAoCarrinho(1, 1, 1); // +1 teclado: deve somar (3), sem linha duplicada
console.log("Após adicionar teclado x2, mouse x1 e teclado +1 (soma, sem duplicar):");
imprimirCarrinho(1);

alterarQuantidade(1, 2, 3);
console.log("\nApós alterar a quantidade do mouse para 3:");
imprimirCarrinho(1);

adicionarAoCarrinho(1, 6, 4);
removerDoCarrinho(1, 6);
console.log("\nApós adicionar e remover o cabo HDMI:");
imprimirCarrinho(1);

// ---------------------------------------------------------------
titulo("4. FINALIZAR PEDIDOS");
const estoqueAntes = buscarProdutoPorId(1)!.estoque;
const pedido1 = finalizarPedido(1);
imprimirPedido(pedido1);
console.log(`\nEstoque do teclado: ${estoqueAntes} -> ${buscarProdutoPorId(1)!.estoque}`);
console.log("Carrinho da Ana após a compra:");
imprimirCarrinho(1);

// Segundo pedido de outro cliente
adicionarAoCarrinho(2, 3, 1);
adicionarAoCarrinho(2, 4, 2);
imprimirPedido(finalizarPedido(2));

console.log("\nPreço histórico: mudo o preço do teclado para R$ 300,00...");
atualizarProduto(1, { preco: 300 });
console.log(`  Pedido #1 continua com o preço original: ${formatarMoeda(listarPedidos()[0].itens[0].precoUnitario)}`);

console.log("\nPedidos da Ana (cliente 1):");
listarPedidosDoCliente(1).forEach((p) => console.log(`  Pedido #${p.id}: ${formatarMoeda(p.total)}`));
console.log(`Total de pedidos registrados: ${listarPedidos().length}`);

// ---------------------------------------------------------------
titulo("5. TESTES DE SITUAÇÕES INVÁLIDAS");
testarInvalido("Cadastrar produto com preço negativo", () =>
  cadastrarProduto({ id: 20, nome: "Produto Ruim", categoria: "Teste", preco: -10, estoque: 5 }));
testarInvalido("Cadastrar produto com id repetido", () =>
  cadastrarProduto({ id: 1, nome: "Duplicado", categoria: "Teste", preco: 10, estoque: 5 }));
testarInvalido("Cadastrar produto com nome vazio", () =>
  cadastrarProduto({ id: 21, nome: "   ", categoria: "Teste", preco: 10, estoque: 5 }));
testarInvalido("Cadastrar produto com estoque negativo", () =>
  cadastrarProduto({ id: 22, nome: "Sem estoque", categoria: "Teste", preco: 10, estoque: -1 }));
testarInvalido("Cadastrar cliente com e-mail repetido", () =>
  cadastrarCliente({ id: 30, nome: "Outra Ana", email: "ANA.SOUZA@email.com" }));
testarInvalido("Cadastrar cliente sem nome", () =>
  cadastrarCliente({ id: 31, nome: "", email: "x@email.com" }));
testarInvalido("Adicionar quantidade maior que o estoque", () =>
  adicionarAoCarrinho(3, 3, 999));
testarInvalido("Adicionar quantidade zero", () => adicionarAoCarrinho(3, 1, 0));
testarInvalido("Adicionar produto inexistente", () => adicionarAoCarrinho(3, 999, 1));
testarInvalido("Finalizar compra sem itens", () => finalizarPedido(3));
testarInvalido("Criar pedido para cliente inexistente", () => finalizarPedido(999));
testarInvalido("Remover produto que já foi vendido", () => removerProdutoDoCatalogo(1));

console.log("\nConsistência da finalização (tudo ou nada):");
adicionarAoCarrinho(3, 6, 5); // 5 cabos (há estoque)
adicionarAoCarrinho(3, 7, 4); // 4 SSDs (há estoque)
atualizarProduto(7, { estoque: 2 }); // o estoque do SSD cai antes da compra
const estoqueCaboAntes = buscarProdutoPorId(6)!.estoque;
testarInvalido("Finalizar com um item sem estoque suficiente", () => finalizarPedido(3));
console.log(`  Estoque do cabo HDMI continua ${buscarProdutoPorId(6)!.estoque} (antes: ${estoqueCaboAntes}) -> nada foi descontado`);
console.log(`  Pedidos registrados continuam: ${listarPedidos().length}`);

// ---------------------------------------------------------------
titulo("6. RELATÓRIOS");
imprimirRelatorioVendas();