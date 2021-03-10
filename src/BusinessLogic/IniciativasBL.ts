import { DataController } from "../Controller/IniciativasController";
import { DataPuntaje } from './PuntajeBL';
import { lists, customFielPWA } from "../Utilities/utils";
import { PeoplePicker } from "../Utilities/PeoplePicker";
import { getTemplateDialog } from "../Template/registro";
import * as BeneficioTemplate from "../Template/BeneficioTemplate";
import { PuntajeController } from "../Controller/PuntajeController";
import { ComiteValoracionController } from "../Controller/ComiteValoracionController";
import { PromoteBl } from "./PromoteBL";

export namespace DataIniciativas {

  export var idIniciativa;

  export async function ReadData(filtro) {

    return await DataController.readData(filtro);
  }

  export async function CreateData(data) {

    delete data.Id;
    delete data.innovacion;
    delete data.Title;
    delete data.ColaboradorStringId;
    delete data.AnalistaAsignadoStringId;


    await PuntajeController.createPuntaje(data)

    
    data.ColaboradorId = data.ColaboradorId.results[0];
    data.AnalistaAsignadoId = data.AnalistaAsignadoId.results[0];

    data.Estado = "espera";
    data.Fase = "Requester";

    if (IniciativasEvents.attach.length) {
      let item = await DataController.createData(data);
      let files = IniciativasEvents.attach.filter(item => { return item["content"] });
      await addAttachment(item["data"]["Id"], files);
    }else return await DataController.createData(data);

  }


  async function addAttachment(id: number, data: Array<any>) {
    return await DataController.addAttachment(id, data);
  }

  export async function UpDate(data: any) {

    let id = data["Id"];

    
    delete data.ColaboradorStringId;
    delete data.AnalistaAsignadoStringId;
    delete data.innovacion;
    delete data.ResponsablesComiteStringId;
    delete data.ResponsablesComiteId;
    delete data.Iniciativa_x0020_Aplazada;
    delete data.Author;
    delete data.EstadoIdea;

    if( data.ColaboradorId){
        data.ColaboradorId = data.ColaboradorId.results[0];
    }

    if(data.AnalistaAsignadoId){
        data.AnalistaAsignadoId = data.AnalistaAsignadoId.results[0];
    }

    //Adjuntos
    if (IniciativasEvents.attach.length) {
      let files = IniciativasEvents.attach.filter(item => { return item["content"] });
      await addAttachment(id, files);
    }

    delete data.Colaborador;
    delete data.AnalistaAsignado;

    if($("#cbst").prop("checked")){
      data.Fase = "Comité de Valoración";

      let aplazada = await lists.ComiteValoracion.items
      .filter("IdIniciativa eq " + data.Id + " and Fase eq 'CV'")
      .get();

      if(aplazada.length >= 1){
        for(let i = 0; i < aplazada.length; i++){
          await lists.ComiteValoracion.items.getById(aplazada[i].Id).update({Fase: "Aplazada"});
        }
      }

      let encargados = await ComiteValoracionController.obtenerEncargados("Fase eq 'CV'");
      ComiteValoracionController.insertarEncargadosComiteValoracion(encargados, data.Id);

      let encargadosId = [];
      for(let i = 0; i < encargados.length; i++){
        encargadosId.push(encargados[i].EncargadoId);
      }

    
      data.ResponsablesComiteId = {results: encargadosId}
      
    }

    if($("#promovido").prop("checked")){
      data.Promovida = true;
      data.Fase = "Promovida";
    }

    return await DataController.updateData(data);
  }

  export async function destroyData(data) {

    return await DataController.deleteData(data);
  }
}


export namespace IniciativasEvents {

  export var Innovacion;

    //Variables Global para Adjuntos
  export let objUpload: kendo.ui.Upload;
  export let attach: Array<any>;
  export var IdModel;
  
  export async function edit(ev: kendo.ui.GridEditEvent) {

    var tabstrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");

    IdModel = ev.model["Id"];



    $(".k-grid-update").html("<span class='k-icon k-i-check'></span>GUARDAR");
    $(".k-grid-cancel").html("<span class='k-icon k-i-cancel'></span>CANCELAR");


    $("#tabHistorico").css("display", "none");
    
  //Funcion Para Datos Adjuntos
      attach = [];
      objUpload = $("#adjuntos").kendoUpload({
      select: onSelect,
      //remove:onRemove,
      }).data("kendoUpload");

      
    //funcion para los Campos tipo Directorio Activo del sistema
    const validator = ev.container.data("kendoValidator");


    


    var Colaborador = new PeoplePicker({
      id: "Colaborador",
      model: ev.model, schema: {
        'PrincipalAccountType': 'User',
        'SearchPrincipalSource': 15,
        'ResolvePrincipalSource': 15,
        'AllowMultipleValues': false,
        'MaximumEntitySuggestions': 50

      },
      validator,
      value: "Colaborador",
      required: true
    });

    var AnalistaAsignado = new PeoplePicker({
        id: "AnalistaAsignado",
        model: ev.model, schema: {
          'PrincipalAccountType': 'User',
          'SearchPrincipalSource': 15,
          'ResolvePrincipalSource': 15,
          'AllowMultipleValues': false,
          'MaximumEntitySuggestions': 50
  
        },
        validator,
        value: "AnalistaAsignado",
        required: true
      });

      
      $("#promoteContent").css("display", "none");



      if (!(ev.model.isNew())) {

        $("#promoteContent").css("display", "block");

        let textB = "COMITÉ DE VALORACIÓN";
        let CBSFT = `<div class='se-div-cbsf'><input type="checkbox" id="cbst" class="k-checkbox"><label class="k-checkbox-label" for="cbst">${textB}</label></div>`;
        ev.container.find(".k-edit-buttons").prepend(CBSFT);

        let promovido = `<div style="display: none;"><input type="checkbox" id="promovido" class="k-checkbox"></div>`;
        ev.container.find(".k-edit-buttons").prepend(promovido);

          var costo = new Intl.NumberFormat().format(ev.model["CostoAproximado"]);

          $("#CostoAproximado").val(costo);

          if(ev.model["Attachments"]){
            let attachments = DataController.getAttachment(ev.model["Id"]);
            
            listAttachments(ev);
    
            $("#listViewDiv").remove();
            
          }

          $("#tabHistorico").css("display", "block");
    
    
          
            
          
          

          $(".NumeroIdea").css("display", "block");
          $("#NumeroIdea").val(ev.model["Id"]);
          $("#NumeroIdea").attr("disabled", "disabled");

          $(".CreadoPor").css("display", "block");
          $("#CreadoPor").val(ev.model["Author"].Title);
          $("#CreadoPor").attr("disabled", "disabled");

          let created = kendo.toString(kendo.parseDate(ev.model["Created"]), "dd-MM-yyyy" )

          $(".FechaCreacion").css("display", "block");
          $("#FechaCreacion").val(created);
          $("#FechaCreacion").attr("disabled", "disabled");


          Colaborador.client.AddUserKeys(ev.model["Colaborador"].Name, false);
          AnalistaAsignado.client.AddUserKeys(ev.model["AnalistaAsignado"].Name, false);

          if(!(ev.model["Fase"] == "Requester" || ev.model["Fase"] == "Aplazada")){
            $(".se-div-cbsf").css("display", "none");
          }


          

          if(ev.model["Promovida"] == true){
            $("#promoteContent").css("display", "none")
            bloquearCampos();
          }else{
            $("#btnPromover").click(function(){
              PromoteProjectOnline.promoteClick(ev);
            });
          }
    
      }


      //funcion del DropDownList  tipo lista
    $("#EstadoIdea").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'EstadoIdea'").get()
            ev.success(result)
          }
        },
      }),
    });

    $("#TipoCosto").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'TipoCosto'").get()
            ev.success(result)
          }
        },
      }),
    });

    $("#UEN").kendoDropDownList({
        optionLabel: "Seleccione un valor",
        dataTextField: "Valor",
        dataValueField: "Id",
        autoWidth: true,
        dataSource: new kendo.data.DataSource({
          transport: {
            read: async (ev) => {
              var result = await lists.MetaData.items.top(10000).filter("Title eq 'UEN'").get();
              ev.success(result)
            }
          },
        }),
      });

      $("#Regional").kendoDropDownList({
        optionLabel: "Seleccione un valor",
        dataTextField: "Valor",
        dataValueField: "Id",
        autoWidth: true,
        dataSource: new kendo.data.DataSource({
          transport: {
            read: async (ev) => {
              var result = await lists.MetaData.items.top(10000).filter("Title eq 'Regional'").get();
              ev.success(result)
            }
          },
        }),
      });

      $("#QueProponer").kendoDropDownList({
        optionLabel: "Seleccione un valor",
        dataTextField: "Valor",
        dataValueField: "Id",
        autoWidth: true,
        dataSource: new kendo.data.DataSource({
          transport: {
            read: async (ev) => {
              var result = await lists.MetaData.items.top(10000).filter("Title eq 'QueProponer'").get();
              ev.success(result)
            }
          },
        }),
      });


      $("#Coordinacion").kendoDropDownList({
        optionLabel: "Seleccione un valor",
        dataTextField: "Valor",
        dataValueField: "Id",
        autoWidth: true,
        dataSource: new kendo.data.DataSource({
          transport: {
            read: async (ev) => {
              var result = await lists.MetaData.items.top(10000).filter("Title eq 'Coordinacion'").get();
              ev.success(result)
            }
          },
        }),
      });

      $("#CostoAproximado").blur(function(){
        if($("#CostoAproximado").val() != ""){
          var costo = new Intl.NumberFormat().format(ev.model["CostoAproximado"]);
          $("#CostoAproximado").val(costo);
        }
      });


    $("#AumentoVentas").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'AumentoVentas'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#EsfuerzoEnTiempo").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'EsfuerzoEnTiempo'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#BeneficioEstimadoServicio").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'BeneficioEstimadoServicio'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#EsfuerzoEnCostos").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'EsfuerzoEnCostos'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#BeneficioEstimadoCosto").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'BeneficioEstimadoCosto'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#IncrementoServicio").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'IncrementoServicio'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#CumplimientoNormativo").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'CumplimientoNormativo'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#ProyectoInnovacion").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'ProyectoInnovacion'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#ReduccionCostos").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Calificacion",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'ReduccionCostos'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#TipoBeneficio").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'TipoBeneficio'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#BeneficioVenta").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'BeneficioVenta'").get();
            ev.success(result)
          }
        },
      }),
    });

    $("#Area").kendoDropDownList({
      optionLabel: "Seleccione un valor",
      dataTextField: "Valor",
      dataValueField: "Id",
      autoWidth: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: async (ev) => {
            var result = await lists.MetaData.items.top(10000).filter("Title eq 'Area'").get();
            ev.success(result)
          }
        },
      }),
    });



    var contentReduccionCostos = `
      <div>
        <p><b>1</b> - de 0,1 a 20 mm</p>
        <p><b>2</b> - de 21 a 40 mm</p>
        <p><b>3</b> - de 41 a 60 mm</p>
        <p><b>4</b> - de 61 a 80 mm</p>
        <p><b>5</b> - de 81 a 100 mm</p>
        <p><b>6</b> - de 101 a 120 mm</p>
        <p><b>7</b> - de 121 a 140 mm</p>
        <p><b>8</b> - de 141 a 160 mm</p>
        <p><b>9</b> - de 161 a 180 mm</p>
        <p><b>10</b> - Mas de 180 Millones de ahorro</p>
      </div>
    `;

    var contentNielDeServicios = `
      <div>
        <p><b>1</b> - 0,10% - 0,19%</p>
        <p><b>2</b> - 0,20% - 0,29%</p>
        <p><b>3</b> - 0,30% - 0,39%</p>
        <p><b>4</b> - 0,40% - 0,49%</p>
        <p><b>5</b> - 0,50% - 0,59%</p>
        <p><b>6</b> - 0,60% - 0,69%</p>
        <p><b>7</b> - 0,70% - 0,79%</p>
        <p><b>8</b> - 0,80% - 0,89%</p>
        <p><b>9</b> - 0,90% - 0,99%</p>
        <p><b>10</b> - Mayor a 1,00%</p>
      </div>
    `;

    var contentInnovacion = `
      <div>
        <p><b>0</b> - No es un proyecto de innovación</p>
        <p><b>5</b> - Es un proyecto de innovación</p>
      </div>
    `;

    $("#gridHistorico th:nth-child(3)").kendoTooltip({
      position: "",
      content: contentReduccionCostos
    }).data("kendoTooltip");

    $("#gridHistorico th:nth-child(4)").kendoTooltip({
      position: "",
      content: contentReduccionCostos
    }).data("kendoTooltip");

    $("#gridHistorico th:nth-child(5)").kendoTooltip({
      position: "",
      content: contentNielDeServicios
    }).data("kendoTooltip");

    $("#gridHistorico th:nth-child(6)").kendoTooltip({
      position: "",
      content: contentInnovacion
    }).data("kendoTooltip");




    var contentEsfuerzoTiempo = `
    <div>
      <p><b>1</b> - Menos de un mes</p>
      <p><b>2</b> - 2 a 4 meses</p>
      <p><b>3</b> - 4 a 5 meses</p>
      <p><b>4</b> - 6 a 7 meses</p>
      <p><b>5</b> - 7 a 8 meses</p>
      <p><b>6</b> - 8 a 9 meses</p>
      <p><b>7</b> - 10 a 11 meses</p>
      <p><b>8</b> - 11 a 12 meses</p>
      <p><b>9</b> - 1 a 2 años</p>
      <p><b>10</b> - Mas de 2 años</p>
    </div>
  `;


    $("#gridHistoricoBeneficio th:nth-child(3)").kendoTooltip({
      position: "",
      content: contentEsfuerzoTiempo
    }).data("kendoTooltip");

    $("#gridHistoricoBeneficio th:nth-child(4)").kendoTooltip({
      position: "",
      content: contentReduccionCostos
    }).data("kendoTooltip");

    validateFields();
    DataGridIniciativas.DataGridHistorico();
    DataGridIniciativas.DataGridHistoricoEsfuerzo();
}

function bloquearCampos(){

  //Principal
  $("#EstadoIdea").attr("disabled", "disabled");
  $("#UEN").attr("disabled", "disabled");
  $("#NombreOportunidad").attr("disabled", "disabled");
  $("#Regional").attr("disabled", "disabled");
  $("#CostoAproximado ").attr("disabled", "disabled");
  $("#Colaborador_TopSpan").attr("disabled", "disabled");
  $("#Colaborador_TopSpan_ResolvedList").attr("disabled", "disabled");
  $("#Telefono").attr("disabled", "disabled");
  $("#Correo").attr("disabled", "disabled");
  $("#QueProponer").attr("disabled", "disabled");
  $("#AnalistaAsignado_TopSpan").attr("disabled", "disabled");
  $("#AnalistaAsignado_TopSpan_ResolvedList").attr("disabled", "disabled");
  $("#Continuidad").attr("disabled", "disabled");
  $(".k-upload").attr("disabled", "disabled");
  $("#btnRemove").css("pointer-events", "none");


  //Beneficios
  $("#AumentoVentas").attr("disabled", "disabled");
  $("#IncrementoServicio").attr("disabled", "disabled");
  $("#CumplimientoNormativo").attr("disabled", "disabled");
  $("#EsfuerzoEnTiempo").attr("disabled", "disabled");
  $("#EsfuerzoEnCostos").attr("disabled", "disabled");
  $("#ReduccionCostos").attr("disabled", "disabled");
  $("#TipoBeneficio").attr("disabled", "disabled");

  //General
  $("#Coordinacion").attr("disabled", "disabled");
  $("#ComentariosEvaluacion").attr("disabled", "disabled");
  $("#DescripcionOportunidad").attr("disabled", "disabled");
  $("#Area").attr("disabled", "disabled");
  $("#IndicadorAsociado").attr("disabled", "disabled");

  $(".sp-peoplepicker-editorInput").attr("disabled", "disabled");

  $("#Colaborador_TopSpan_ResolvedList a").attr("onclick", "");
  $("#Colaborador_TopSpan_ResolvedList a").css("cursor", "not-allowed");
  $("#AnalistaAsignado_TopSpan_ResolvedList a").attr("onclick", "");
  $("#AnalistaAsignado_TopSpan_ResolvedList a").css("cursor", "not-allowed");
  

  $(".k-grid-update").attr("disabled", "disabled");
}

 //Function of validation fields
 export function validateFields(){

  var validator = $("#tabstrip").kendoValidator().data("kendoValidator");

  $(".k-grid-update").click(function(){

    var innovacion1 = $("#innovacion1").prop("checked");
    var innovacion2 = $("#innovacion2").prop("checked");
    // if(){

    // }

    var camposVaciosPrincipal = [];
    camposVaciosPrincipal.push("<b>PRINCIPAL</b>");

    var camposVaciosBeneficios = [];
    camposVaciosBeneficios.push("<b>BENEFICIOS</b>");

    var camposVaciosGeneral = [];
    camposVaciosGeneral.push("<b>GENERAL</b>");

    //Campos PRINCIPAL
    if (!validator.validateInput($("input[name=EstadoIdea]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Estado de la Idéa</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=UEN]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>UEN</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=NombreOportunidad]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Nombre de la Oportunidad</b> es obligatorio");

    }
    if (!validator.validateInput($("input[name=Regional]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Regional</b> es obligatorio");

    }
    if (!validator.validateInput($("input[name=CostoAproximado]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Costo Apróximado</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=Colaborador_TopSpan_HiddenInput]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Colaborador</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=Telefono]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Teléfono</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=Correo]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Correo</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=SitioAplicacion]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Sitio de Aplicación</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=QueProponer]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>¿Qué quieres proponer?</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=AnalistaAsignado_TopSpan_HiddenInput]"))) {
      camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Analista Asignado</b> es obligatorio");
      
    }

    //Campos BENEFICIO
    if (!validator.validateInput($("input[name=Beneficio]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=ReduccionCostos]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio - Reducción Costos</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=BeneficioEstimadoCosto]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio Estimado Costo</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=AumentoVentas]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Aumento Ventas</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=IncrementoServicio]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Nivel de Servicio</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=CumplimientoNormativo]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Cumplimiento Normativo</b> es obligatorio");
      
    }
    if (innovacion1 == false && innovacion2 == false) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Proyecto Innovación</b> es obligatorio");
    }
    if (!validator.validateInput($("input[name=EsfuerzoEnTiempo]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Esfuerzo Tiempo</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=EsfuerzoEnCostos]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Esfuerzo Costos</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=TipoBeneficio]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Tipo de Beneficio</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=BeneficioEstimadoServicio]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio Estimado Servicio</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=BeneficioVenta]"))) {
      camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio Venta</b> es obligatorio");
      
    }



    //Campos GENERAL
    if (!validator.validateInput($("input[name=Coordinacion]"))) {
      camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Coordinación</b> es obligatorio");
      
    }
    if (!validator.validateInput($("textarea[name=ComentariosEvaluacion]"))) {
      camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Comentarios de evaluación</b> es obligatorio");
      
    }
    if (!validator.validateInput($("textarea[name=DescripcionOportunidad]"))) {
      camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Descripción Oportunidad</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=RutaAcceso]"))) {
      camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Ruta de Acceso</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=Area]"))) {
      camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Área a la que pertenece</b> es obligatorio");
      
    }
    if (!validator.validateInput($("input[name=IndicadorAsociado]"))) {
      camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>¿Tiene un Indicador Asociado? ¿Cuál?</b> es obligatorio");
      
    }

    if(!(camposVaciosPrincipal.length == 1)){
      var camposObligatoriosPrincipal = camposVaciosPrincipal.join("<br><br>");
    }

    if(!(camposVaciosBeneficios.length == 1)){
      var camposObligatoriosBeneficio = camposVaciosBeneficios.join("<br><br>");
    }

    if(!(camposVaciosGeneral.length == 1)){
      var camposObligatoriosGeneral = camposVaciosGeneral.join("<br><br>");
    }
    
    

    if(camposVaciosPrincipal.length != 1 || camposVaciosBeneficios.length != 1 || camposVaciosGeneral.length != 1){
      showNotificationWindow(camposObligatoriosPrincipal, camposObligatoriosBeneficio, camposObligatoriosGeneral);
    }

    if(innovacion1 == false && innovacion2 == false){
      return false;
    }
    
  }); 
}

  //Funcion onselect Para Adjuntos 
 function onSelect(ev: kendo.ui.UploadSelectEvent) {
  let allow = true;
  let arrCh = ['~', '#', '%', '&', '*', '{', '}', '\\', ':', '<', '>', '?', '/', '|', '“'];

  //extraer el nombre
  arrCh.forEach((i) => {
    if (ev.files[0].name.includes(i)) {
      ev.preventDefault();
      allow = false;

    }
  });

  //no Acepta Duplicados
  attach.forEach(element => {
    ev.files.forEach(select => {
      if (element["name"] === select["name"]) {
        allow = false;
        ev.preventDefault();
       
      }
    });
  });

  
  if (allow) {
    let count = 0;
    objUpload.toggle(true);
    ev.files.forEach(element => {
      let reader = new window.FileReader();
      reader.onload = function (e) {
        attach.push({ 'content': e.target.result, 'name': element["name"] });
        count++;
        if (ev.files.length == count) objUpload.toggle(true);
      };
      reader.readAsArrayBuffer(element.rawFile);
    });
  }
 }

  function listAttachments(e){
    
    let currentFile;
    const documentos =  lists.Iniciativas.items.getById(e.model["Id"]).attachmentFiles.get().then(result=>{
      
      currentFile = result[0];
      const listViewDiv = document.createElement("div");
      $("#listViewAttachment").append(listViewDiv);
      $(listViewDiv).kendoListView({    
        dataSource: { data: result },
        remove: async function (ev) {
          ev.preventDefault();
          kendo.ui.progress($("#listViewDiv"), true);
          await lists.Iniciativas.items.getById(e.model["Id"]).attachmentFiles.getByName(ev.model["FileName"]).recycle()
          $(listViewDiv).data("kendoListView").dataSource.remove(ev.model);
          kendo.ui.progress($("#listViewDiv"), false);
        },
        template: (documento) => {
          return `
            <li style="list-style-type: decimal;margin-left: 5px; margin-top: 8px; width: auto;">
              <a style="vertical-align: middle;" target="_blank" href="${documento.ServerRelativeUrl}"> ${documento.FileName}</a>
              <a id="btnRemove" style="display:#:visi#" class="k-button k-delete-button" ><span class="k-icon k-i-close"></span></a>
            </li>
          `;
        }
      })
    });
  }

  export function NotificationSuccess(msg:string){
    var popupNotification = $("#popupNotification")
    .kendoNotification({
      position: {
        top: 20
      }
    })
    .data("kendoNotification");
  
    popupNotification.show(kendo.toString(msg), "success");
  }
  
  export function NotificationError(msg:string){
    var popupNotification = $("#popupNotification")
    .kendoNotification({
      position: {
        top: 20
      },
      autoHideAfter: 10000
    })
    .data("kendoNotification");
  
    popupNotification.show(kendo.toString(msg), "error");
  }

  function showNotificationWindow(data1, data2, data3){
    
    let div = document.createElement("div.notificaciones");
    let windowConfir = $(div).kendoWindow({
      width: "430px",
      height: "200",
      title: "Notificación",
      visible: false,
      content: {
        template:  `
        <div>
        <div>
          ${data1}
        </div>

        <hr />

        <div>
          ${data2}
        </div>

        <hr />

        <div>
          ${data3}
        </div>

      </div>
        `
    },
      actions: [
          "Close"
      ],
      close: () => {
        windowConfir.destroy();
    },
  }).data("kendoWindow").center().open();


  }
}

export namespace DataGridIniciativas{

  export var Historico;
  export var HistoricoEsfuerzo;

  export function DataGridHistorico(){
    var dataSourceHistorico = new kendo.data.DataSource({
      pageSize: 3,
        transport: {
          read: async (e) => {
            let result = await lists.Historico.items
            .orderBy("Created", false)
            .select("*", "Author/Title")
            .expand("Author")
            .filter("IdIniciativa eq " + IniciativasEvents.IdModel)
            .get();

            for (let index = 0; index < result.length; index++) {
              result[index].Author = result[index].Author.Title;
            }

            var innovacion = result[0].Innovacion;
            

            if(innovacion == 0){
                $("#innovacion1").prop("checked", true);
            }else if(innovacion == 5){
                $("#innovacion2").prop("checked", true);
            }
            
            
            e.success(result);
          }
        },
        schema: {
          model: {
            id: "Id",
            fields: {
              Title: { type: "string" },
              Created: {type: "Date", template: "#= kendo.toString(kendo.parseDate(Created), 'dd-MM-yyyy'); #"},
            }
          }
        }
    });
  
    const grid = $("#gridHistorico")
      .kendoGrid({
        columns: [
          { field: "Created", title: "Fecha", format: "{0: dd-MM-yyyy}" },
          { field: "Author", title: "Autor" },
          { field: "ReduccionCostos", title: "Reducción Costos" },
          { field: "AumentoVentas", title: "Aumento Ventas" },
          { field: "NivelDeServicio", title: "Nivel de Servicio" },
          // { field: "Innovacion", title: "Innovación" },
          { field: "BeneficioCalculado", title: "Beneficio Calculado", attributes: { "class": "hola", style: "background: rgb(252, 220, 25); color: rgb(222, 0, 0)" } }
        ],
        autoBind: true,
        dataSource: dataSourceHistorico,
        pageable: {
          buttonCount: 3
        },
        editable: {
          mode: "popup",
          //template: PuntajeTemplate.getTemplate(),
          window: { title: "Puntaje" }
        },
        sortable: true,
        selectable: true
      })
      .data("kendoGrid");
  }

  export function DataGridHistoricoEsfuerzo(){
    var dataSourceHistoricoEsfuerzo = new kendo.data.DataSource({
      pageSize: 3,
        transport: {
          read: async (e) => {
            let result = await lists.HistoricoEsfuerzo.items
            .orderBy("Created", false)
            .select("*", "Author/Title")
            .expand("Author")
            .filter("IdIniciativa eq " + IniciativasEvents.IdModel)
            .get();

            for (let index = 0; index < result.length; index++) {
              result[index].Author = result[index].Author.Title;
            }
            
            e.success(result);
          }
        },
        schema: {
          model: {
            id: "Id",
            fields: {
              Title: { type: "string" },
              Created: {type: "Date", template: "#= kendo.toString(kendo.parseDate(Created), 'dd-MM-yyyy'); #"},
            }
          }
        }
    });

      const grid2 = $("#gridHistoricoBeneficio")
      .kendoGrid({
        columns: [
          { field: "Created", title: "Fecha", format: "{0: dd-MM-yyyy}" },
          { field: "Author", title: "Autor" },
          { field: "EsfuerzoTiempo", title: "Esfuerzo Tiempo" },
          { field: "EsfuerzoCostos", title: "Esfuerzo Costos" },
          { field: "EsfuerzoCalculado", title: "Esfuerzo Calculado", attributes: { style: "background: rgb(252, 220, 25); color: rgb(222, 0, 0)" } },
          { field: "EB", title: "E * B", attributes: { style: "background: rgb(252, 220, 25); color: rgb(222, 0, 0)" } }
        ],
        autoBind: true,
        dataSource: dataSourceHistoricoEsfuerzo,
        pageable: {
          buttonCount: 3
        },
        editable: {
          mode: "popup",
          //template: PuntajeTemplate.getTemplate(),
          window: { title: "Puntaje" }
        },
        sortable: true,
        selectable: true
      })
      .data("kendoGrid");
  }
}

export namespace PromoteProjectOnline{

  export function promoteClick(e) {

    let dataItem =  e.model;

    console.log(dataItem);
    window.promoteBl = PromoteBl;

    let div = document.createElement("div");

    //window.waitDialog;

    const windowConfir = $(div).kendoWindow({
        visible: false,
        width: "430px",
        title: "Notificación",
        modal: true,
        draggable: false,
        content: {
            template: getTemplateDialog(dataItem)
        },
        close: () => {
            windowConfir.destroy();
        },
    }).data("kendoWindow").center().open();

    let validationForm = $("#formConf").kendoValidator().data("kendoValidator");

    $("#yesButton").click(async (btnE) => {
        btnE.preventDefault();
        if (validationForm.validate()) {
            //windowConfir.destroy();
            let timer: number, idPro: string;
            //kendo.ui.progress($("#GridIniciativas"), true);

            let divd = document.createElement("div");
            let windowDialog = $(divd)
                .kendoDialog({
                    modal: true,
                    closable: false,
                    content: `
                <p class="se-msn-loading">Creando proyecto...</p>
                `,
                }).data("kendoDialog").open();


            let checker = async () => {
                clearInterval(timer);
                let responseCheckOut = await PromoteBl.checkOutProject(idPro, FormDigestValue);

                let checkOut = await responseCheckOut.json();


                if (responseCheckOut.ok) {
                    updateCustomFields(dataItem, idPro, FormDigestValue,windowDialog);
                }
                else {
                    timer = setInterval(checker, 5000);
                  //  console.log(checkOut);
                }

            };

            let result = await PromoteBl.getContextInfoPWA();
            let context = await result.json();
            let FormDigestValue = context.d.GetContextWebInformation.FormDigestValue;

            var objRegistro = {
                parameters: {
                    Name: dataItem.NombreOportunidad,
                    // EnterpriseProjectTypeId: $("#tipoProyecto").val()
                }
            }
            windowConfir.destroy();
            let responseProject = await PromoteBl.createProject(objRegistro, FormDigestValue);
            let project = await responseProject.json();
            if (!responseProject.ok) {
                if (project.error.message.value.includes("ProjectNameAlreadyExists")){
                    IniciativasEvents.NotificationError("El proyecto ya existe en PWA.");
                    windowDialog.close();
                }else if (project.error.message.value.includes("ProjectNameInvalid")){
                  IniciativasEvents.NotificationError("Nombre de proyecto no valido.");
                }else {
                    IniciativasEvents.NotificationError("Error al crear el proyecto.");
                    alert(project.error.message.value);
                }
                return;
            }
            //window.waitDialog.close(SP.UI.DialogResult.OK);
            IniciativasEvents.NotificationSuccess("Proyecto creado con éxito.");
            windowDialog.close();
            windowDialog.content('<p class="se-msn-loading">Actualizando campos personalizados...</p>');
            windowDialog.open();

            //IniciativaBL.setIniciativa(dataItem.Id);


            idPro = project["d"].Id;
            
            //updateCustomFields(dataItem, idPro, FormDigestValue);
            timer = setInterval(checker, 5000);

        }
    });

    $("#noButton").click(async (btnE) => {
        btnE.preventDefault();
        windowConfir.destroy();
    });

    let ddltp = $("#tipoProyecto").kendoDropDownList({
        dataSource: {
            transport: {
                read: async e => {
                    e.success(await PromoteBl.getEnterpriseProjectTypes());
                }
            },
        },
        dataTextField: "Name",
        dataValueField: "Id",
        optionLabel: "Seleccione tipo de proyecto...",
        autoWidth: true,
    }).data("kendoDropDownList");

  }

  async function updateCustomFields(data: any, idPro, FormDigestValue,control) {


  let objCustomFields = { customFieldDictionary: [] };

  // customFielPWA.fields.forEach(function (field, i) {
  //     let setValue: string;

  //     // var uen = $("#UEN").data("kendoDropDownList").dataItem().GUID_ID;
  //     // console.log(uen);
      
  //     // var alineacionItinerario = $("#AlineacionItinerario").data("kendoMultiSelect").dataItems().GUID_ID;
  //     // var alineacionMetas = $("#AlineacionMetas").data("kendoMultiSelect").dataItems().GUID_ID;
  //     // var beneficios = $("#Beneficios").data("kendoMultiSelect").dataItems().GUID_ID;
  //     // var publicoImpactado = $("#PublicoImpactado").data("kendoMultiSelect").dataItems().GUID_ID;

  //     // switch (field.campo) {
  //     //     case "Unidad Negocio": //DropDown       
  //     //         if(data["UEN"]){

  //     //           setValue = "Entry_" + field.lookup.find(f => f.value == data["UEN"]).key.replace(/-/g, "");
  //     //         }
              
  //     //         console.log(setValue);
  //     //         break;
          
  //         // case "Alineación Itinerario"://MultiSelect
  //         //     if(data["AlineacionItinerario"]){
  //         //       setValue = "";
  //         //       data["AlineacionItinerario"].forEach(function(item){  
  //         //           let ele = field.lookup.find(f => f.value == item.Valor).key;              
  //         //           setValue += ele.replace(/-/g,"") + ";#";
  //         //           console.log(setValue);
  //         //       });
  //         //     }
              
  //         //     break;
          
  //         // case "Beneficios"://MultiSelect
  //         //     if(data["Beneficios"]){
  //         //       setValue = "";
  //         //       data["Beneficios"].forEach(function(item){  
  //         //         let ele = field.lookup.find(f => f.value == item.Valor).key;              
  //         //         setValue += ele.replace(/-/g,"") + ";#";
  //         //         console.log(setValue);
  //         //       });
  //         //     }
  //         //     break;

  //         // case "Restricciones iniciales":
  //         //     setValue = data["Restricciones"];
  //         //     break;

  //         // case "Riesgos Iniciales":
  //         //     setValue = data["RiesgosIniciales"];
  //         //     break;

  //         // case "Público Impactado"://MultiSelect
  //         //     if(data["PublicoImpactado"]){
  //         //       setValue = "";
  //         //       data["PublicoImpactado"].forEach(function(item){  
  //         //         let ele = field.lookup.find(f => f.value == item.Valor).key;              
  //         //         setValue += ele.replace(/-/g,"") + ";#";
  //         //         console.log(setValue);
  //         //       });
  //         //     }
  //         //     break;

  //         // case "Patrocinador":
  //         //   if(data["Patrocinador"]){
  //         //     setValue = "";
  //         //     data["Patrocinador"].forEach(element => {
  //         //       setValue += element.Title + ",";
  //         //     });
  //         //   }
              
  //         //     break;
  //     //}

  //     if (setValue) {
  //         objCustomFields.customFieldDictionary.push({
  //             Key: "Custom_" + field.id.replace(/-/g, ""),
  //             ValueType: "Edm." + field.type,
  //             Value: setValue
  //         });
  //     }


  // });
  


  let responseCustomFields = await PromoteBl.updateCustomFields(idPro, FormDigestValue, objCustomFields);

  let customFields = await responseCustomFields.json();

  if (responseCustomFields.ok) {
      let responseCheckIn = await PromoteBl.checkInProject(idPro, FormDigestValue);

      let checkIn = await responseCheckIn.json();

      if (responseCheckIn.ok) {
          control.close();
          control.destroy();
          IniciativasEvents.NotificationSuccess("Campos personalizados actualizados con éxito.");
          
          //Setear el valor Promovido en el dropdown
          

          $("#promovido").attr("checked", "checked");
          $(".k-grid-update").trigger("click");

          
          $("#grid").data("kendoGrid").dataSource.read();
          
      }

  } else {
      IniciativasEvents.NotificationError("Error actualizando los campos personalizados.");
      IniciativasEvents.NotificationError(customFields.error.message.value);
      console.log(customFields.error.message.value);
  }

  }
} 