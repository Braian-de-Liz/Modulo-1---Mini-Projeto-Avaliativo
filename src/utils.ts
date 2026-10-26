// Funções auxiliaers compartilhadas entre os módulos.

// Arredonda para 2 casas decimais
export function arredondar(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100)/ 100;
}
export function formatarMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
}

export function formatarData(data: Date): string {
    return data.toLocaleString("pt-BR");
}