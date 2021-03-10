import { lists } from "../Utilities/utils";

export namespace HistoricoBL{

    export var esfuerzo_tiempo;
    export var esfuerzo_costo;
    export var reduccion_costo;
    export var aumento_ventas;
    export var innovacion;
    export var nivel_de_servicio;

    export async function addHistorico(data){
        return await lists.Historico.items.add(data);
        
    }

    export async function addHistoricoEsfuerzo(data){
        return await lists.HistoricoEsfuerzo.items.add(data);
        
    }

    export async  function calcularCampos(){

        let pesoReduccionCosto = await lists.MetaData.items
        .filter("Title eq 'ReduccionCostos' and Calificacion eq '1'")
        .get();
        reduccion_costo = parseInt(pesoReduccionCosto[0].qmrp)/100;

        let pesoAumentoVentas = await lists.MetaData.items
        .filter("Title eq 'AumentoVentas' and Calificacion eq '1'")
        .get();
        aumento_ventas = parseInt(pesoAumentoVentas[0].qmrp)/100;

        let pesoNivelDeServicio = await lists.MetaData.items
        .filter("Title eq 'IncrementoServicio' and Calificacion eq '1'")
        .get();
        nivel_de_servicio = parseInt(pesoNivelDeServicio[0].qmrp)/100;

        let pesoEsfuerzoCosto = await lists.MetaData.items
        .filter("Title eq 'EsfuerzoEnCostos' and Calificacion eq '1'")
        .get();
        esfuerzo_costo = parseInt(pesoEsfuerzoCosto[0].qmrp)/100;

        let pesoEsfuerzoTiempo = await lists.MetaData.items
        .filter("Title eq 'EsfuerzoEnTiempo' and Calificacion eq '1'")
        .get();
        esfuerzo_tiempo = parseInt(pesoEsfuerzoTiempo[0].qmrp)/100;
    }
}