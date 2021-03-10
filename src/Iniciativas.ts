import "./Style/Styles.css";
import * as IniciativaTemplate from "./Template/IniciativasTemplate";
import { IniciativasEvents ,DataIniciativas } from "./BusinessLogic/IniciativasBL";
import { lists } from "./Utilities/utils";
import * as ComiteTemplate from "./Template/ComiteValoracionTemplate";
import { ComiteEvents, DataComite } from "./BusinessLogic/ComiteValoracionBL";

/* Si a la url se le pasa por parametro el Id de la inciativa, 
   se hace el filtro para que muestre solo ese registro.
*/
export var filtro;

let Url = window.location.href.split("=");

if(Url.length > 1){
    var id = parseInt(Url[1]);
    filtro = "Id eq "+"'"+id+"'";
}else{
    filtro = "";
}

var dataSource = 
new kendo.data.DataSource({
    pageSize: 8,
    transport: {
        read: async (ev) => {
            let result = await DataIniciativas.ReadData(filtro);
            
            ev.success(result);
        },
        create: async (ev) => {
            await DataIniciativas.CreateData(ev.data);
            dataSource.read();
        },
        update: async (ev) => {
            await DataIniciativas.UpDate(ev.data);
            dataSource.read();
        },
        destroy: async (ev) => {
            await DataIniciativas.destroyData(ev.data);
            dataSource.read();
        }
    },
    schema: {
        model: {
            id: "Id",
            fields: {
                Title: { type: "string" },
                EstadoIdeaId: { type: "number" },
                UENId: { type: "number" },
                RegionalId: { type: "number" },
                QueProponerId: { type: "number" },
                ReduccionCostosId: { type: "number" },
                AumentoVentasId: { type: "number" },
                IncrementoServicioId: { type: "number" },
                CumplimientoNormativoId: { type: "number" },
                ProyectoInnovacionId: { type: "number" },
                BeneficioEstimadoServicioId: { type: "number" },
                BeneficioEstimadoCostoId: { type: "number" },
                BeneficioVentaId: { type: "number" },
                EsfuerzoEnTiempoId: { type: "number" },
                EsfuerzoEnCostosId: { type: "number" },
                CoordinacionId: { type: "number" },
                CalificacionId: { type: "number" },
                AreaId: { type: "number" },
                Created: { type: "Date", template: '#= kendo.toString(kendo.parseDate(Created), "dd-MM-yyyy" ) #' }
            }
        }
    }
});



let comando = [];

lists.GrupoIniciativas.items
.filter(String.format("ResponsablesId eq '{0}' and Title eq 'Responsables Iniciativas'", _spPageContextInfo.userId))
.get().then(result => {

  

                if (result.length>0) {
                    comando.push(
                        { 
                            name: "edit", 
                            text: "EDITAR", 
                            iconClass: "k-icon k-i-edit no-margin"
                        },
                        { 
                            name: "delete",
                            text: "ELIMINAR"
                        }
                    );
                }else{
                    comando.push(
                        { 
                            name: "edit", 
                            text: "EDITAR", 
                            iconClass: "k-icon k-i-edit no-margin",
                            visible: function(dataItem){
                                if(dataItem.Fase == "Requester" && dataItem.AuthorId == _spPageContextInfo.userId){
                                    return true;
                                }

                                if(dataItem.Fase == "Aplazada" && dataItem.AuthorId == _spPageContextInfo.userId){
                                    return true;
                                }

                                if(dataItem.ResponsablesComiteId != null){
                                    let count = 0;
                                    for(let i = 0; i < dataItem.ResponsablesComiteId.length; i++){
                                      
                                      if(dataItem.ResponsablesComiteId[i] == _spPageContextInfo.userId){
                                        count += 1
                                      }
                                    }
          
                                    if(count > 0){
                                      return true;
                                    }else{
                                        return false;
                                      }
                                      
                                    
                                  }
                            }
                        },
                    );
                }

const grid = $("#grid").kendoGrid({
    columns: [
        { field: "Id", title: "ID", filterable: { multi: true, search: true}, width: 150 },
        { field: "NombreOportunidad", title: "Nombre de la oportunidad", filterable: { multi: true, search: true}, width: 600 },
        { field: "Estado", title: "Estado", template: templateEstado, filterable: { multi: true, search: true}, width: 200 },
        { field: "Fase", title: "Fase", filterable: { multi: true, search: true}, width: 400 },

        { command: comando}
    ],
    editable: {
       mode: "popup",
       template: IniciativaTemplate.GetTemplate(),
       window: { title: "Iniciativas" }
   },
    edit: IniciativasEvents.edit,
    autoBind: true,
    toolbar: [{
        name: "create",
        text: "Nueva Iniciativa",
    }],
    dataSource: dataSource,
    filterable: true,
    pageable: {
        alwaysVisible: false,
        pageSizes: [6, 12, 24, 50, 100],
        buttonCount: 3
    },
    sortable: true,
    selectable: true,
    groupable: {
        messages: {
          empty: "Arrastre el encabezado de una columna y suéltelo aquí para agrupar por esa columna"
        }
    },
    detailInit: detailInit
}).data("kendoGrid");

});


function templateEstado(item) {
    var clase;
    switch (item.Estado) {
        case "espera":
            clase = "k-i-clock";
            break;
        case "aprobada":
            clase = "k-i-check-circle";
            break;
        case "aplazada":
            clase = "k-i-clock";
            break;
        case "rechazada":
            clase = "k-i-close-circle";
            break;
        case "descartada":
            clase = "k-i-close-circle";
            break;
        case "descalificada":
            clase = "k-i-close-circle";
            break;
    
    }
    return String.format("<span style='font-size: 20px;' class='k-icon {0}'></span>", clase);
}

function templateEstadoComite(item) {
    var clase;
    switch (item.Estado) {
        case "espera":
            clase = "k-i-clock";
            break;
        case "aprobado":
            clase = "k-i-check-circle";
            break;
        case "rechazado":
            clase = "k-i-close-circle";
            break;
        case "equipo":
            clase = "k-i-plus-circle";
            break;
        case "diligenciado":
            clase = "k-i-plus-circle";
            break;
    
    }
    return String.format("<span style='font-size: 20px;' class='k-icon {0}'></span>", clase);
}

function templateFase(item) {
    var label;
    switch (item.Fase) {
        case "CV":
            label = "Comité de Valoración";
            break;
        case "CGD":
            label = "Comité Gestion Demanda";
            break;
        case "EProd":
            label = "Equipo de Productividad";
            break;
        case "EProy":
            label = "Equipo de Proyectos";
            break;
        case "Aplazada":
            label = "Comité de Valoración (Aplazada)";
            break;
        case "CP":
            label = "Comité Patrocinador";
            break;
    
    }
    return String.format("<span style='font-size: 16px;'>{0}</span>", label);
}


async function detailInit(e) {

    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: async (ev) => {
                    await lists.ComiteValoracion.items
                    .select("*", "Encargado/Title")
                    .expand("Encargado")
                    .filter("IdIniciativa eq " +e.data.Id)
                    .get()
                    .then(result => {
                        for(let i = 0; i < result.length; i++){
                            if(result[i].Encargado){
                                result[i].Encargado = result[i].Encargado[0].Title;
                            }
                        }
                        
                        ev.success(result);
                        
                    });
                },
                update: async (ev) => {
                    delete ev.data.EncargadoId;
                    delete ev.data.Encargado;
                    delete ev.data.EncargadoEmail;
                    delete ev.data.EncargadoStringId;

                    await DataComite.updateData(ev.data);
                    dataSource.read();
                    ev.success();
                }
            },
            serverSorting: true,
            pageSize: 10,
            filter: { field: "IdIniciativa", operator: "eq", value: e.data.Id },
            schema: {
                model: {
                    id: "IdIniciativa"
                }
            }
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        columns: [
            { field: "Encargado", title: "Encargado", width: 350 },
            { field: "Estado", title: "Estado", template: templateEstadoComite, width: 200 },
            { field: "Fase", title: "Fase", template: templateFase, width: 250 },
            { field: "Comentario", title: "Comentario", width: 500 },

            {
                command: [
                    
                    {name: "edit", text: "EDITAR", iconClass: "k-icon k-i-edit"
                    , visible: function(dataItem){
                        if(dataItem.EncargadoId[0] == _spPageContextInfo.userId && dataItem.Estado == "espera"){
                            return true;
                        }

                        if(dataItem.EncargadoId[0] == _spPageContextInfo.userId && dataItem.Estado == "equipo"){
                            return true;
                        }
					}
                    
                }
                ]
            }
        ],
        editable: {
            mode: "popup",
            template: ComiteTemplate.getTemplate(),
            window: { title: "Valoración de la Iniciativa" }
        },
        edit: ComiteEvents.edit
    });
}