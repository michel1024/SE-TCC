import { PuntajeController } from "../Controller/PuntajeController";
import { lists } from "../Utilities/utils";


export namespace DataPuntaje{

    export async function createPuntaje(data){
        delete data.Id;
        delete data.Title;
        
        await PuntajeController.createPuntaje(data);
    }

    export async function updatePuntaje(data){
        delete data.Title;

        await PuntajeController.updatePuntaje(data);
    }
}