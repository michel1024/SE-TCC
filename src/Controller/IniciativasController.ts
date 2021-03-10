import { lists } from "../Utilities/utils";
import { IniciativasEvents, DataIniciativas, DataGridIniciativas } from "../BusinessLogic/IniciativasBL";
import { DataPuntaje } from "../BusinessLogic/PuntajeBL";
import { PuntajeController } from "./PuntajeController";
import { HistoricoBL } from "../BusinessLogic/HistoricoBL";
import { ComiteValoracionController } from "./ComiteValoracionController";

export namespace DataController {


    export async function readData(filtro){
        let result = await lists.Iniciativas.items
        .orderBy("Created", false)
        .select("*", "Colaborador/Name", "AnalistaAsignado/Name", "Author/Title", "EstadoIdea/Valor", "UEN/Valor")
        .expand("Colaborador", "AnalistaAsignado", "Author", "EstadoIdea", "UEN")
        .filter(filtro)
        .get()

        return result;
    }

    export async function createData(data){

      let promesas = [];
            
      await promesas.push(await lists.Iniciativas.items.add(data));
      
      DataGridIniciativas.Historico[0].IdIniciativa = promesas[0].data.Id;
      DataGridIniciativas.HistoricoEsfuerzo[0].IdIniciativa = promesas[0].data.Id;

      await promesas.push(await HistoricoBL.addHistorico(DataGridIniciativas.Historico[0]));
      await promesas.push(await HistoricoBL.addHistoricoEsfuerzo(DataGridIniciativas.HistoricoEsfuerzo[0]));

      

      Promise.all(promesas).then((result) => {
        IniciativasEvents.NotificationSuccess("Una nueva iniciativa fue agregada");
        $("#grid").data("kendoGrid").dataSource.read();
        $("#gridHistoricoBeneficio").data("kendoGrid").dataSource.read();
        
        return result;
      });

    }

    export async function updateData(data){
        
            
                let result = await lists.Iniciativas.items.getById(data.Id).update(data);

                await PuntajeController.updatePuntaje(data);

                if(PuntajeController.cambio){
                    DataGridIniciativas.Historico[0].IdIniciativa = data.Id;
                    await HistoricoBL.addHistorico(DataGridIniciativas.Historico[0]);
                    $("#gridHistorico").data("kendoGrid").dataSource.read();
                }

                if(PuntajeController.cambioEsfuerzo){
                    DataGridIniciativas.HistoricoEsfuerzo[0].IdIniciativa = data.Id;
                    await HistoricoBL.addHistoricoEsfuerzo(DataGridIniciativas.HistoricoEsfuerzo[0]);
                    $("#gridHistoricoBeneficio").data("kendoGrid").dataSource.read();
                }


                IniciativasEvents.NotificationSuccess("Una iniciativa fue modificada con exito");
                $("#grid").data("kendoGrid").dataSource.read();
                return result;
       
    }

    export async function deleteData(data){
        let result = await lists.Iniciativas.items.getById(data.Id).delete();
        IniciativasEvents.NotificationSuccess("Una iniciativa fue eliminada con exito");
        return result;
    }








    export async function addAttachment(id:number, data:Array<any>){
        let result =  await lists.Iniciativas.items.getById(id).attachmentFiles.addMultiple(data);
        return result;
    }
      
    
    export async function getAttachment(id:number){
      return await lists.Iniciativas.items.getById(id).attachmentFiles.get();
    }
  
    
    export async function deleteAttachment(id:number,name:string){
      try {
        let result =  await lists.Iniciativas.items.getById(id).attachmentFiles.getByName(name).delete();
        IniciativasEvents.NotificationSuccess("Adjuntos eliminados con exito");
        return result;
      } catch {
        IniciativasEvents.NotificationError("Ocurrió un error al eliminar los adjuntos");
      }
    }


}