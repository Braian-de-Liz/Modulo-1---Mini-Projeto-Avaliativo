// Tipos usado por todo o sistema.

export type Produto = {

    id:number;
    nome:string;
    categoria:string;// preço unitário em reais
    estoque:number; // quantidade disponivel

};

export type Cliente = {

    id: number;
    nome: string;
    email: string;

};

export type ItemCarrinho = {

    produtoId:number;
    quantidade:number;

};

export type Carrinho = {

    clienteId:number;
    itens: ItemCarrinho[];

};


// Informações detalhada do item, com nome, preço e subtotal
export type ItemDetalhado = ItemCarrinho & {

    nome: string;
    precoUnitario: number;
    subtital: number;

};


// Item de um pedido: guarda a informações do pedido no momento da compra
//
export type ItemPedido = {
    produtoId: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
};

export type Pedido = {

    id: number;
    clienteId: number;
    itens: ItemPedido[];
    total: number;
    data: Date;

}