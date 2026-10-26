# Miniprojeto E-commerce

- **Estudante:** _Rafael Franklin de Farias_
- **Turma:** _Node - T5_
- **Curso:** Desenvolvedor Back-End Node — Módulo 1, Semana 07 (Mini-Projeto Avaliativo)

## Objetivo

Sistema de gerenciamento de e-commerce em TypeScript/Node.js que administra um catálogo de produtos, clientes, carrinhos de compra e pedidos, mantendo estoque e valores consistentes durante a execução. O foco é a lógica de back-end, a tipagem e a organização do código (sem interface, banco de dados ou pagamentos).

## Funcionalidades implementadas

- **Produtos:** cadastrar, listar, buscar por id, buscar por parte do nome, filtrar por categoria, atualizar e remover.
- **Clientes:** cadastrar, listar e buscar por id (3 clientes iniciais).
- **Carrinho:** adicionar, remover, alterar quantidade, listar itens, calcular subtotal e total.
- **Pedidos:** finalizar compra, consultar todos os pedidos e os de um cliente; baixa automática de estoque.
- **Relatórios:** faturamento, ticket médio, vendas por cliente, produtos mais vendidos e estoque baixo.

## Tecnologias

TypeScript 5, Node.js e npm. Nenhuma biblioteca externa em tempo de execução (apenas `typescript` e `@types/node` como dependências de desenvolvimento).

## Estrutura dos arquivos

```
Miniprojeto_Ecommerce/
├── src/
│   ├── types.ts       # tipos: Produto, Cliente, ItemCarrinho, Carrinho, ItemPedido, Pedido
│   ├── utils.ts       # arredondamento e formatação (moeda/data)
│   ├── produtos.ts    # catálogo: cadastro, consulta, atualização, remoção
│   ├── clientes.ts    # cadastro e consulta de clientes
│   ├── carrinho.ts    # operações do carrinho e cálculos
│   ├── pedidos.ts     # finalização e consulta de pedidos
│   ├── relatorios.ts  # consolidação e exibição de resultados
│   └── main.ts        # demonstração das funcionalidades
├── package.json
├── tsconfig.json
└── README.md
```

## Como compilar e executar

Requer Node.js 18+ instalado.

```bash
npm install     # instala o TypeScript
npm run build   # compila src/ para dist/ (tsc)
npm start       # executa dist/main.js com o Node
```

Ou, em um só passo: `npm run dev`.

## Exemplos das principais operações

```ts
cadastrarProduto({ id: 7, nome: "SSD 480GB", categoria: "Armazenamento", preco: 289.9, estoque: 12 });
buscarProdutosPorNome("tecl");          // encontra "Teclado Mecânico"
adicionarAoCarrinho(1, 1, 2);           // cliente 1 leva 2 unidades do produto 1
alterarQuantidade(1, 1, 3);             // passa a quantidade para 3
const pedido = finalizarPedido(1);      // gera o pedido e baixa o estoque
listarPedidosDoCliente(1);              // pedidos do cliente 1
```

O `main.ts` executa um fluxo completo e imprime os resultados no terminal.

## Regras de negócio implementadas

**Produtos**
- Id único e inteiro positivo; nome e categoria não vazios; preço maior que zero; estoque inteiro e não negativo.
- Produto já vendido não pode ser removido (preserva o histórico).
- Ao remover um produto, ele também sai dos carrinhos.

**Clientes**
- Nome e e-mail obrigatórios, e-mail com formato válido.
- Id e e-mail únicos (e-mail comparado sem diferenciar maiúsculas/minúsculas).

**Carrinho**
- Quantidade deve ser inteira e maior que zero.
- Não aceita produto inexistente nem quantidade acima do estoque.
- Adicionar o mesmo produto de novo soma a quantidade (sem linhas duplicadas); a soma também respeita o estoque.
- Subtotal = preço × quantidade; total = soma dos subtotais (arredondado a 2 casas).

**Pedidos**
- Exige cliente existente e carrinho com itens.
- **Tudo ou nada:** todos os itens são validados antes de qualquer alteração; se um falhar, nenhum estoque é descontado e nenhum pedido é registrado.
- O pedido guarda o preço praticado na compra, então mudanças posteriores no catálogo não o alteram.
- Id único por contador; data de criação registrada; carrinho esvaziado após a compra.

## Limitações conhecidas

- Dados apenas em memória: tudo é perdido ao encerrar o programa.
- Sem autenticação, pagamento, frete, cupons ou impostos.
- Sem concorrência: pressupõe uma única execução por vez.
- Os testes são demonstrados no `main.ts` (não há framework de testes automatizados).
