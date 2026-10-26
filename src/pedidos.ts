import { limparCarrinho, listarItensCarrinho, removerProdutoDeTodosCarrinhos} from "./carrinho";
import { buscarClientePorId } from "./clientes";
import { baixarEstoque, buscarProdutoPorId, removerProduto } from "./produtos";
import { ItemPedido, Pedido, Produto } from "./types";
import { arredondar } from "./utils";

const pedidos: Pedido[] = [];
let proximoId = 1; // garante que cada id seja único

export function finalizarPedido(clienteId: number): Pedido {
    if(!buscarClientePorId(clienteId)) {
        throw new Error('Não é possível criar pedido: cliente ${clienteId} não existe.');
    }
    const itensCarrinho = listarItensCarrinho(clienteId);
    if(itensCarrinho.length === 0) {
        throw new Error("Não é possível finalizar um pedido com o carrinho vazio.");
    }

    // Etapa de validação
    const problemas: string[] = [];
    const itensPedido: ItemPedido[] = [];

    itensCarrinho.forEach((item) => {
        const produto: Produto | undefined = buscarProdutoPorId(item.produtoId);
        if(!produto) {
            problemas.push('produto "${item.produtoId}" (pedido ${item.quantidade}, disponível ${produto.estoque})');
            return;
        }
// Guarda o preço de agora: mudanças futuras no catálogo não afetam este pedido.
    itensPedido.push({
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      subtotal: arredondar(produto.preco * item.quantidade),
    });
  });

  if (problemas.length > 0) {
    throw new Error(`Pedido não registrado: ${problemas.join("; ")}.`);
  }

  // 2ª etapa: tudo validado, agora é seguro gravar.
  itensPedido.forEach((item) => baixarEstoque(item.produtoId, item.quantidade));

  const pedido: Pedido = {
    id: proximoId++,
    clienteId,
    itens: itensPedido,
    total: arredondar(itensPedido.reduce((soma, i) => soma + i.subtotal, 0)),
    data: new Date(),
  };
  pedidos.push(pedido);
  limparCarrinho(clienteId);
  return pedido;
}

export function listarPedidos(): Pedido[] {
  return pedidos.map((p) => ({ ...p, itens: p.itens.map((i) => ({ ...i })) }));
}

export function listarPedidosDoCliente(clienteId: number): Pedido[] {
  if (!buscarClientePorId(clienteId)) {
    throw new Error(`Cliente ${clienteId} não encontrado.`);
  }
  return listarPedidos().filter((p) => p.clienteId === clienteId);
}

export function produtoJaFoiVendido(produtoId: number): boolean {
  return pedidos.some((p) => p.itens.some((i) => i.produtoId === produtoId));
}

// Remoção "completa": aplica a regra de pedidos e limpa carrinhos.
export function removerProdutoDoCatalogo(produtoId: number): Produto {
  const removido = removerProduto(produtoId, produtoJaFoiVendido);
  removerProdutoDeTodosCarrinhos(produtoId);
  return removido;
}
