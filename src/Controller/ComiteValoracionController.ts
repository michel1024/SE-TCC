import { lists } from "../Utilities/utils";
import { IniciativasEvents } from "../BusinessLogic/IniciativasBL";

export namespace ComiteValoracionController{
    export async function obtenerEncargados(filtro){
        let result = await lists.EncargadosComite.items
        .filter(filtro)
        .get()
        
        return result;
    }

    

    export async function validarDiligenciamientoComiteValoracion(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'espera' and Fase eq 'CV' and IdIniciativa eq " +id)
        .get()

        return result;
    }

    export async function validarDiligenciamientoComiteGestionDemanda(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'espera' and Fase eq 'CGD' and IdIniciativa eq " +id)
        .get()

        return result;
    }

    export async function validarDiligenciamientoComitePatrocinadores(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'espera' and Fase eq 'CP' and IdIniciativa eq " +id)
        .get()

        return result;
    }

    export async function validarDiligenciamientoEquipoProductividad(id){
        let result = await lists.ComiteValoracion.items
        .filter("EProductividadCompletado eq 'no' and Fase eq 'EProd' and IdIniciativa eq " +id)
        .get()

        return result;
    }

    export async function validarDiligenciamientoEquipoProyectos(id){
        let result = await lists.ComiteValoracion.items
        .filter("EProyectosCompletado eq 'no' and Fase eq 'EProy' and IdIniciativa eq " +id)
        .get()

        return result;
    }

    export async function aprobacionesComiteValoracion(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'aprobado' and Fase eq 'CV' and IdIniciativa eq " + id)
        .get()

        return result;
    }

    export async function aprobacionesComiteGestionDemanda(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'aprobado' and Fase eq 'CGD' and IdIniciativa eq " + id)
        .get()

        return result;
    }

    export async function aprobacionesComitePatrocinadores(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'aprobado' and Fase eq 'CP' and IdIniciativa eq " + id)
        .get()

        return result;
    }

    export async function aprobacionesEquipoProductividad(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'aprobado' and Fase eq 'EProd' and IdIniciativa eq " + id)
        .get()

        return result;
    }

    export async function aprobacionesEquipoProyectos(id){
        let result = await lists.ComiteValoracion.items
        .filter("Estado eq 'aprobado' and Fase eq 'EProy' and IdIniciativa eq " + id)
        .get()

        return result;
    }

    export async function insertarEncargadosComiteValoracion(result, id){
        for(let i = 0; i < result.length; i++){
            delete result[i].EncargadoStringId;
            let data = {
                EncargadoId: {results:[result[i].EncargadoId]},
                Estado: "espera",
                IdIniciativa: id,
                Fase: "CV"
            };
            await lists.ComiteValoracion.items.add(data);
            
        }
        
    }

    export async function insertarEncargadosComiteGestionDemanda(result, id){
        for(let i = 0; i < result.length; i++){
            let data = {
                EncargadoId: {results:[result[i].EncargadoId]},
                Estado: "espera",
                IdIniciativa: id,
                Fase: "CGD"
            };
            await lists.ComiteValoracion.items.add(data);
        }
    }

    export async function insertarEncargadosComitePatrocinadores(result, id){
        for(let i = 0; i < result.length; i++){
            let data = {
                EncargadoId: {results:[result[i].EncargadoId]},
                Estado: "espera",
                IdIniciativa: id,
                Fase: "CP"
            };
            await lists.ComiteValoracion.items.add(data);
        }
    }


    export async function insertarEquipoProductividad(result, id){
        for(let i = 0; i < result.length; i++){
            let data = {
                EncargadoId: {results:[result[i].EncargadoId]},
                Estado: "equipo",
                IdIniciativa: id,
                Fase: "EProd"
            };
            await lists.ComiteValoracion.items.add(data);
        }
    }

    export async function insertarEquipoProyectos(result, id){
        for(let i = 0; i < result.length; i++){
            let data = {
                EncargadoId: {results:[result[i].EncargadoId]},
                Estado: "equipo",
                IdIniciativa: id,
                Fase: "EProy"
            };
            await lists.ComiteValoracion.items.add(data);
        }
    }






    export async function insertarEncargadosCGD(result, id){
        let EncargadoId = [];
        for(let i = 0; i < result.length; i++){
            EncargadoId.push(result[i].EncargadoId);
        }
        await lists.Iniciativas.items.getById(id).update({ResponsablesComiteId: {results: EncargadoId}});
    }

    export async function insertarEncargadosCP(result, id){
        let EncargadoId = [];
        for(let i = 0; i < result.length; i++){
            EncargadoId.push(result[i].EncargadoId);
        }
        await lists.Iniciativas.items.getById(id).update({ResponsablesComiteId: {results: EncargadoId}});
    }


    export async function insertarEProd(result, id){
        let EncargadoId = [];
        for(let i = 0; i < result.length; i++){
            EncargadoId.push(result[i].EncargadoId);
        }
        await lists.Iniciativas.items.getById(id).update({ResponsablesComiteId: {results: EncargadoId}});
    }

    export async function insertarEProy(result, id){
        let EncargadoId = [];
        for(let i = 0; i < result.length; i++){
            EncargadoId.push(result[i].EncargadoId);
        }
        await lists.Iniciativas.items.getById(id).update({ResponsablesComiteId: {results: EncargadoId}});
    }

    export async function vaciarEncargados(id){
        await lists.Iniciativas.items.getById(id).update({ResponsablesComiteId: {results: []}});
    }



    export async function update(data){
        
        let result = await lists.ComiteValoracion.items.getById(data.Id).update(data);

        IniciativasEvents.NotificationSuccess("Datos ingresados con exito");

        return result;
    }
}