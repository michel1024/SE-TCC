import { lists } from "../Utilities/utils";
import { DataIniciativas, DataGridIniciativas, IniciativasEvents } from "../BusinessLogic/IniciativasBL";
import { HistoricoBL } from "../BusinessLogic/HistoricoBL";

export namespace PuntajeController{

    export var dataBeneficio;
    export var cambio;
    export var cambioEsfuerzo;

    export async function createPuntaje(data){

        await HistoricoBL.calcularCampos();

        var BeneficioCalculado = data.ReduccionCostosId * HistoricoBL.reduccion_costo + (data.AumentoVentasId * HistoricoBL.aumento_ventas) + (data.IncrementoServicioId * HistoricoBL.nivel_de_servicio);
    
        var EsfuerzoCalculado = data.EsfuerzoEnTiempoId * HistoricoBL.esfuerzo_tiempo + (data.EsfuerzoEnCostosId * HistoricoBL.esfuerzo_costo);
        

        var eb1 = BeneficioCalculado * (1/EsfuerzoCalculado);
        var eb = eb1.toFixed(2);

        


        DataGridIniciativas.Historico = [
            {
                IdIniciativa: 0,
                BeneficioCosto: data.BeneficioEstimadoCostoId,
                AumentoVentas: data.AumentoVentasId,
                NivelDeServicio: data.IncrementoServicioId,
                ReduccionCostos: data.ReduccionCostosId,
                BeneficioCalculado: BeneficioCalculado
            }
        ];

        DataGridIniciativas.HistoricoEsfuerzo = [
            {
                IdIniciativa: 0,
                EsfuerzoTiempo: data.EsfuerzoEnTiempoId,
                EsfuerzoCostos: data.EsfuerzoEnCostosId,
                EsfuerzoCalculado: EsfuerzoCalculado,
                EB: eb
            }
        ];

    }

    export async function updatePuntaje(data){

        await HistoricoBL.calcularCampos();

        let result = await lists.Historico.items.
        filter("IdIniciativa eq " + data.Id)
        .get();

        let result2 = await lists.HistoricoEsfuerzo.items.
        filter("IdIniciativa eq " + data.Id)
        .get();

        var index1 = result.length -1;
        var index2 = result2.length -1;

        if(result[index1].BeneficioCosto != data.BeneficioEstimadoCostoId ||
            result[index1].AumentoVentas != data.AumentoVentasId ||
            result[index1].NivelDeServicio != data.IncrementoServicioId ||
            result[index1].ReduccionCostos != data.ReduccionCostosId
        ){

                cambio = true;

        }else{
            cambio = false;
        }

        if(result2[index2].EsfuerzoTiempo != data.EsfuerzoEnTiempoId || result2[index2].EsfuerzoCostos != data.EsfuerzoEnCostosId){

                cambioEsfuerzo = true;

        }else{
            cambioEsfuerzo = false;
        }


        if(cambio){
            var BeneficioCalculado = data.ReduccionCostosId * HistoricoBL.reduccion_costo + (data.AumentoVentasId * HistoricoBL.aumento_ventas) + (data.IncrementoServicioId * HistoricoBL.nivel_de_servicio);


            DataGridIniciativas.Historico = [
                {
                    IdIniciativa: data.IdIniciativa,
                    BeneficioCosto: data.BeneficioEstimadoCostoId,
                    AumentoVentas: data.AumentoVentasId,
                    NivelDeServicio: data.IncrementoServicioId,
                    ReduccionCostos: data.ReduccionCostosId,
                    BeneficioCalculado: BeneficioCalculado
                }
            ];
        }

        if(cambioEsfuerzo){
            var eb1;
            var EsfuerzoCalculado = data.EsfuerzoEnTiempoId * HistoricoBL.esfuerzo_tiempo + (data.EsfuerzoEnCostosId * HistoricoBL.esfuerzo_costo);
            
            if(BeneficioCalculado != null && EsfuerzoCalculado != null){
                eb1 = BeneficioCalculado * (1/EsfuerzoCalculado);
                var eb = eb1.toFixed(2);
            }else{
                eb = 0;
            }
            
            DataGridIniciativas.HistoricoEsfuerzo = [
                {
                    IdIniciativa: data.IdIniciativa,
                    EsfuerzoTiempo: data.EsfuerzoEnTiempoId,
                    EsfuerzoCostos: data.EsfuerzoEnCostosId,
                    EsfuerzoCalculado: EsfuerzoCalculado,
                    EB: eb
                }
            ];
        }
    }
}