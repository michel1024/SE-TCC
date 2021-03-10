import { ComiteValoracionController } from "../Controller/ComiteValoracionController";
import { DataController } from "../Controller/IniciativasController";
import { lists } from "../Utilities/utils";
import { LimitedWebPartManager } from "@pnp/sp/webparts";

export namespace DataComite{
    export var comite2: boolean;

    export async function updateData(data: any){
        delete data.gender1;
        delete data.Title;

        if($("#aprobado").prop("checked")){
            data.Estado = "aprobado";
        }

        if($("#rechazado").prop("checked")){
            data.Estado = "rechazado";
        }

        await ComiteValoracionController.update(data);

        let cv = await ComiteValoracionController.validarDiligenciamientoComiteValoracion(data.IdIniciativa);
        let cgd = await ComiteValoracionController.validarDiligenciamientoComiteGestionDemanda(data.IdIniciativa);
        let cp = await ComiteValoracionController.validarDiligenciamientoComitePatrocinadores(data.IdIniciativa);
        let eprod = await ComiteValoracionController.validarDiligenciamientoEquipoProductividad(data.IdIniciativa);
        let eproy = await ComiteValoracionController.validarDiligenciamientoEquipoProyectos(data.IdIniciativa);

        if(data.Fase == "CV"){
            if(!(cv.length >= 1)){
                movimientoFase1(data);
            }
        }

        if(data.Fase == "CGD"){
            if(!(cgd.length >= 1)){
                movimientoFase3(data);
            }
        }

        if(data.Fase == "CP"){
            if(!(cp.length >= 1)){
                movimientoFase4(data);
            }
        }

        if(data.Fase == "EProd"){
            if(!(eprod.length >= 1)){
                movimientoFase2A(data);
            }
        }

        if(data.Fase == "EProy"){
            if(!(eproy.length >= 1)){
                movimientoFase2B(data);
            }
        }
    }

    export async function movimientoFase1(data){
        // Obtener cantidad de encargados
        let encargados = await ComiteValoracionController.obtenerEncargados("Fase eq 'CV'");
        // Obtener cantidad de aprobaciones
        let aprobados = await ComiteValoracionController.aprobacionesComiteValoracion(data.IdIniciativa);

        let porcentaje = encargados[0].Peso * aprobados.length;
        
        
        if(porcentaje >= encargados[0].Tope){

            // Obtener el campo Continuidad
            let continuidad = await lists.Iniciativas.items.filter("Id eq " + data.IdIniciativa).get();
            // Validar si es un proyecto de cntinuidad
            if(continuidad[0].Continuidad == true){

                

                let datos = {
                    NotificacionContinuidad: true,
                    Fase: "Evaluación Equipo de Productividad",
                    Notificacion: true,
                    Requester: false
                }
                await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);

                let encargadosEProd = await ComiteValoracionController.obtenerEncargados("Fase eq 'EProd'");
                ComiteValoracionController.insertarEquipoProductividad(encargadosEProd, data.IdIniciativa);
                ComiteValoracionController.insertarEProd(encargadosEProd, data.IdIniciativa);
            }else{

                

                let datos = {
                    NotificacionContinuidad: true,
                    Fase: "Evaluación Equipo de Proyectos",
                    Notificacion: true,
                    Requester: false
                }
                await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);

                let encargadosEProy = await ComiteValoracionController.obtenerEncargados("Fase eq 'EProy'");
                ComiteValoracionController.insertarEquipoProyectos(encargadosEProy, data.IdIniciativa);
                ComiteValoracionController.insertarEProy(encargadosEProy, data.IdIniciativa);
            }

            $("#grid").data("kendoGrid").dataSource.read();
        }else{

            let result = await lists.Iniciativas.items
            .filter("Id eq "+data.IdIniciativa)
            .get();

            if(result[0].contador_aplazadas == true){
                ComiteValoracionController.vaciarEncargados(data.IdIniciativa);
                
                let devolucion2 = {
                    Fase: "Cerrada",
                    Requester: false,
                    Estado: "descalificada"
                };
    
                await lists.Iniciativas.items.getById(data.IdIniciativa).update(devolucion2);
    
                $("#grid").data("kendoGrid").dataSource.read();
            }else{
                let devolucion = {
                    Fase: "Aplazada",
                    Requester: true,
                    Notificacion: true,
                    contador_aplazadas: true,
                    Estado: "aplazada"
                };

                await lists.Iniciativas.items.getById(data.IdIniciativa).update(devolucion);

                $("#grid").data("kendoGrid").dataSource.read();
            }
            
            
            
        }
    }

    export async function movimientoFase2A(data){

        comite2 = true;

        let datos = {
            NotificacionContinuidad: true,
            Notificacion: true,
            Requester: false,
            Fase: "Comité Gestión de la Demanda"
        }
        await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);


        let encargados2 = await ComiteValoracionController.obtenerEncargados("Fase eq 'CGD'");
        ComiteValoracionController.insertarEncargadosComiteGestionDemanda(encargados2, data.IdIniciativa);
        ComiteValoracionController.insertarEncargadosCGD(encargados2, data.IdIniciativa);

        $("#grid").data("kendoGrid").dataSource.read();
    }

    export async function movimientoFase2B(data){

        comite2 = true;

        let datos = {
            NotificacionContinuidad: true,
            Notificacion: true,
            Requester: false,
            Fase: "Comité Gestión de la Demanda"
        }
        await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);


        let encargados2 = await ComiteValoracionController.obtenerEncargados("Fase eq 'CGD'");
        ComiteValoracionController.insertarEncargadosComiteGestionDemanda(encargados2, data.IdIniciativa);
        ComiteValoracionController.insertarEncargadosCGD(encargados2, data.IdIniciativa);

        $("#grid").data("kendoGrid").dataSource.read();
    }

    export async function movimientoFase3(data){
        // Obtener cantidad de encargados
        let encargados = await ComiteValoracionController.obtenerEncargados("Fase eq 'CGD'");
        // Obtener cantidad de aprobaciones
        let aprobados = await ComiteValoracionController.aprobacionesComiteGestionDemanda(data.IdIniciativa);

        let porcentaje = encargados[0].Peso * aprobados.length;
        
        
        if(porcentaje >= encargados[0].Tope){

            // Obtener el campo Continuidad
            let continuidad = await lists.Iniciativas.items.filter("Id eq " + data.IdIniciativa).get();
            
            let encargadosCP = await ComiteValoracionController.obtenerEncargados("Fase eq 'CP'");
            ComiteValoracionController.insertarEncargadosComitePatrocinadores(encargadosCP, data.IdIniciativa);
            ComiteValoracionController.insertarEncargadosCP(encargadosCP, data.IdIniciativa);

            let datos = {
                NotificacionContinuidad: true,
                Fase: "Comité Patrocinador",
                Notificacion: true,
                Requester: false
            }
            await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);

            $("#grid").data("kendoGrid").dataSource.read();
        }else{

            ComiteValoracionController.vaciarEncargados(data.IdIniciativa);

            let result = await lists.Iniciativas.items
            .filter("Id eq "+data.IdIniciativa)
            .get();

            
            let devolucion2 = {
                Fase: "Cerrada",
                Requester: false,
                Estado: "rechazada"
            };

            await lists.Iniciativas.items.getById(data.IdIniciativa).update(devolucion2);

            $("#grid").data("kendoGrid").dataSource.read();
        }
    }

    export async function movimientoFase4(data){
        let encargados2 = await ComiteValoracionController.obtenerEncargados("Fase eq 'CP'");
        let aprobados2 = await ComiteValoracionController.aprobacionesComitePatrocinadores(data.IdIniciativa);

        let porcentaje = encargados2[0].Peso * aprobados2.length;

        if(porcentaje >= encargados2[0].Tope){
            ComiteValoracionController.vaciarEncargados(data.IdIniciativa);

            let datos = {
                Estado: "aprobada",
                Fase: "Cerrada"
            }
            await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);
            $("#grid").data("kendoGrid").dataSource.read();

        }else{
            ComiteValoracionController.vaciarEncargados(data.IdIniciativa);

            let datos = {
                Estado: "descartada",
                Fase: "Cerrada"
            }
            await lists.Iniciativas.items.getById(data.IdIniciativa).update(datos);
            $("#grid").data("kendoGrid").dataSource.read();
        }
    }
}

export namespace ComiteEvents{
    export function edit(ev: kendo.ui.GridEditEvent){
        var tabstrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");

        $(".k-grid-update").html("<span class='k-icon k-i-check'></span>GUARDAR");
        $(".k-grid-cancel").html("<span class='k-icon k-i-cancel'></span>CANCELAR");

        $("#Encargado").attr("disabled", "disabled");

        $(".tabstrip-valoracion").closest(".k-window").css("transform", "translateY(-50px)");

        if(!(ev.model.isNew())){

            if(ev.model["Fase"] == "EProd" || ev.model["Fase"] == "EProy"){
                $("#boxApprover").css("display", "none");
            }
            
            if(ev.model["Estado"] == "aprobado"){
                $("#aprobado").prop("checked", true);
            }

            if(ev.model["Estado"] == "rechazado"){
                $("#rechazado").prop("checked", true);
            }

            $(".k-grid-cancel, .k-i-close").click(function(){
                $("#grid").data("kendoGrid").dataSource.read();
            });

            if(ev.model["Fase"] == "EProd"){
                ev.model["EProductividadCompletado"] = true;
                ev.model["Estado"] = "diligenciado";
            }

            if(ev.model["Fase"] == "EProy"){
                ev.model["EProyectosCompletado"] = true;
                ev.model["Estado"] = "diligenciado";
            }
        }
    }
}