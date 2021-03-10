import { ui } from "../Utilities/utils";



const { renderFieldDetail } = ui;

// Principal
const EstadoIdea = renderFieldDetail({ id: "EstadoIdea", className: "input dropdown", title: "Estado de la iniciativa ", type: "input", name: "EstadoIdea", others: "validationMessage='Este campo es obligatorio'", value: "EstadoIdeaId", required: true })
const UEN = renderFieldDetail({ id: "UEN", className: "input dropdown", title: "UEN ", type: "input", name: "UEN", others: "validationMessage='Este campo es obligatorio'", value: "UENId", required: true })
const NombreOportunidad = renderFieldDetail({ id: "NombreOportunidad", className: "input", title: "Nombre de la oportunidad ", type: "input", name: "NombreOportunidad", others: "validationMessage='Este campo es obligatorio'", value: "NombreOportunidad", required: true })
const Regional = renderFieldDetail({ id: "Regional", className: "input dropdown", title: "Regional ", type: "input", name: "Regional", others: "validationMessage='Este campo es obligatorio'", value: "RegionalId", required: true })
const CostoAproximado = renderFieldDetail({ id: "CostoAproximado", className: "input", title: "Costo aproximado ", type: "input", name: "CostoAproximado", others: "validationMessage='Este campo es obligatorio' autocomplete='off' type='number'", value: "CostoAproximado", required: true })
const TipoCosto = renderFieldDetail({ id: "TipoCosto", className: "input dropdown", title: "Tipo Costo", type: "input", name: "TipoCosto", others: "validationMessage='Este campo es obligatorio'", value: "TipoCostoId", required: true })
const Colaborador = renderFieldDetail({ id: "Colaborador", className: "", title: "Colaborador ", type: "div", name: "Colaborador", others: "validationMessage='Este campo es obligatorio'", value: "Colaborador", required: true })
const Telefono = renderFieldDetail({ id: "Telefono", className: "input", title: "Teléfono ", type: "input", name: "Telefono", others: "validationMessage='Este campo es obligatorio'", value: "Telefono", required: true })
const Correo = renderFieldDetail({ id: "Correo", className: "input", title: "Correo ", type: "input", name: "Correo", others: "validationMessage='Este campo es obligatorio'type='email'", value: "Correo", required: true })
const SitioAplicacion = renderFieldDetail({ id: "SitioAplicacion", className: "input", title: "Sitio de aplicación ", type: "input", name: "SitioAplicacion", others: "validationMessage='Este campo es obligatorio'", value: "SitioAplicacion", required: true })
const QueProponer = renderFieldDetail({ id: "QueProponer", className: "input dropdown", title: "¿Qué quieres proponer? ", type: "input", name: "QueProponer", others: "validationMessage='Este campo es obligatorio'", value: "QueProponerId", required: true })
const AnalistaAsignado = renderFieldDetail({ id: "AnalistaAsignado", className: "", title: "Analista asignado", type: "div", name: "AnalistaAsignado", others: "validationMessage='Este campo es obligatorio'", value: "AnalistaAsignado", required: true })
const Continuidad = renderFieldDetail ({id: "Continuidad", className: "k-checkbox", title: "", type: "input", name: "Continuidad", others:"type='checkbox'",value:"",required: false})


// Beneficios

const BeneficioEstimadoCosto = renderFieldDetail({ id: "BeneficioEstimadoCosto", className: "input dropdown", title: "Beneficio Costo", type: "input", name: "BeneficioEstimadoCosto", others: "validationMessage='Este campo es obligatorio'", value: "BeneficioEstimadoCostoId", required: true })
const AumentoVentas = renderFieldDetail({ id: "AumentoVentas", className: "input dropdown", title: "Aumento Ventas ", type: "input", name: "AumentoVentas", others: "validationMessage='Este campo es obligatorio'", value: "AumentoVentasId", required: true })
const IncrementoServicio = renderFieldDetail({ id: "IncrementoServicio", className: "input dropdown", title: "Nivel De Servicio", type: "input", name: "IncrementoServicio", others: "validationMessage='Este campo es obligatorio'", value: "IncrementoServicioId", required: true })
const CumplimientoNormativo = renderFieldDetail({ id: "CumplimientoNormativo", className: "input dropdown", title: "Cumplimiento Normativo ", type: "input", name: "CumplimientoNormativo", others: "validationMessage='Este campo es obligatorio'", value: "CumplimientoNormativoId", required: true })
const ProyectoInnovacion = renderFieldDetail({ id: "ProyectoInnovacion", className: "input dropdown", title: "Proyecto de Innovación", type: "input", name: "ProyectoInnovacion", others: "validationMessage='Este campo es obligatorio'", value: "ProyectoInnovacionId", required: true })
const EsfuerzoEnTiempo = renderFieldDetail({ id: "EsfuerzoEnTiempo", className: "input dropdown", title: "Esfuerzo Tiempo ", type: "input", name: "EsfuerzoEnTiempo", others: "validationMessage='Este campo es obligatorio'", value: "EsfuerzoEnTiempoId", required: true })
const EsfuerzoEnCostos = renderFieldDetail({ id: "EsfuerzoEnCostos", className: "input dropdown", title: "Nivel de Inversión ", type: "input", name: "EsfuerzoEnCostos", others: "validationMessage='Este campo es obligatorio'", value: "EsfuerzoEnCostosId", required: true })
const Beneficio = renderFieldDetail({ id: "Beneficio", className: "input", title: "Beneficio ", type: "input", name: "Beneficio", others: "validationMessage='Este campo es obligatorio'", value: "Beneficio", required: true })
const ReduccionCostos = renderFieldDetail({ id: "ReduccionCostos", className: "input dropdown", title: "Reducción de costos", type: "input", name: "ReduccionCostos", others: "validationMessage='Este campo es obligatorio'", value: "ReduccionCostosId", required: true })
const TipoBeneficio = renderFieldDetail({ id: "TipoBeneficio", className: "input dropdown", title: "Tipo de beneficio", type: "input", name: "TipoBeneficio", others: "validationMessage='Este campo es obligatorio'", value: "TipoBeneficioId", required: true })
const BeneficioEstimadoServicio = renderFieldDetail({ id: "BeneficioEstimadoServicio", className: "input dropdown", title: "Beneficio Estimado Servicio", type: "input", name: "BeneficioEstimadoServicio", others: "validationMessage='Este campo es obligatorio'", value: "BeneficioEstimadoServicioId", required: true })
const BeneficioVenta = renderFieldDetail({ id: "BeneficioVenta", className: "input dropdown", title: "Beneficio Venta", type: "input", name: "BeneficioVenta", others: "validationMessage='Este campo es obligatorio'", value: "BeneficioVentaId", required: true })


// General
const Coordinacion = renderFieldDetail({ id: "Coordinacion", className: "input dropdown", title: "Coordinación", type: "input", name: "Coordinacion", others: "validationMessage='Este campo es obligatorio'", value: "CoordinacionId", required: true })
const ComentariosEvaluacion = renderFieldDetail({ id: "ComentariosEvaluacion", className: "input textarea", title: "Comentarios de evaluación", type: "textarea", name: "ComentariosEvaluacion", others: "validationMessage='Este campo es obligatorio'", value: "ComentariosEvaluacion", required: true })
const DescripcionOportunidad = renderFieldDetail({ id: "DescripcionOportunidad", className: "input textarea", title: "Descripción Oportunidad", type: "textarea", name: "DescripcionOportunidad", others: "validationMessage='Este campo es obligatorio'", value: "DescripcionOportunidad", required: true })
const Area = renderFieldDetail({ id: "Area", className: "input dropdown", title: "Área a la que pertenece", type: "input", name: "Area", others: "validationMessage='Este campo es obligatorio'", value: "AreaId", required: true })
const IndicadorAsociado = renderFieldDetail({ id: "IndicadorAsociado", className: "input textarea", title: "¿Tiene un Indicador Asociado? ¿Cuál?", type: "textarea", name: "IndicadorAsociado", others: "validationMessage='Este campo es obligatorio'", value: "IndicadorAsociado", required: true })



export function getAttachments(): string{
	return `
	<li style="list-style-type: decimal;">
		<a target="_blank" style="vertical-align: middle;" href="#=ServerRelativeUrl#">#= FileName #</a>
		<a class="k-delete-button" href="#"><span class="k-icon k-i-close"><span></a>
	</li>
	
	`;
}



/**
 * Funcion que pemite devolver un String 
 */
export function GetTemplate(): string {
    return `
    <div id="tabstrip">
        <ul>
            <li class="k-state-active">Principal</li>
            <li>Beneficios</li>
            <li>General</li>
            <li id="tabHistorico">Histórico</li>
        </ul>


        <div class="edit-container">
            <div class="columns">
                <div class="column is-6">

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${NombreOportunidad}
                        <span class="k-invalid-msg" data-for="NombreOportunidad"></span>
                    </div>

                    <div class="column is-11 NumeroIdea">
                        <label>Numero de idea</label><br />
                        <input type="text" class="input" id="NumeroIdea" name="NumeroIdea" />
                        <span class="k-invalid-msg" data-for="PublicoImpactado"></span>
                    </div>


                    <div class="column is-11 col-titulo">
                        <span class="required-icon">*</span>
                        ${EstadoIdea}
                        <span class="k-invalid-msg" data-for="EstadoIdea"></span>
                    </div>

                                
                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${UEN}
                        <span class="k-invalid-msg" data-for="UEN"></span>
                    </div>
                    
                    <div class="column is-7" id="columnCosto">
                        <span class="required-icon">*</span>
                            ${CostoAproximado}
                        <span class="k-invalid-msg" data-for="CostoAproximado"></span>
                    </div>  

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${Regional}
                        <span class="k-invalid-msg" data-for="Regional"></span>
                    </div>  

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${Telefono}
                        <span class="k-invalid-msg" data-for="Telefono"></span>
                    </div>  

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${IndicadorAsociado}
                        <span class="k-invalid-msg" data-for="IndicadorAsociado"></span>
                    </div> 
                </div>      
                            
                <div class="column is-6">

                    <div class="column is-11 CreadoPor">
                        <label>Creado por</label><br />
                        <input type="text" class="input" id="CreadoPor" name="CreadoPor" />
                        <span class="k-invalid-msg" data-for="PublicoImpactado"></span>
                    </div>

                    <div class="column is-11 FechaCreacion">
                        <label>Fecha de creación</label><br />
                        <input type="text" class="input" id="FechaCreacion" name="FechaCreacion" />
                        <span class="k-invalid-msg" data-for="PublicoImpactado"></span>
                    </div>


                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${Area}
                        <span class="k-invalid-msg" data-for="Area"></span>
                    </div> 


                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${Colaborador}
                        <span class="k-invalid-msg" data-for="Colaborador"></span>
                    </div>

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${Correo}
                        <span class="k-invalid-msg" data-for="Correo"></span>
                    </div> 

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${QueProponer}
                        <span class="k-invalid-msg" data-for="QueProponer"></span>
                    </div> 
                    
                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${DescripcionOportunidad}
                        <span class="k-invalid-msg" data-for="DescripcionOportunidad"></span>
                    </div>

                    <div class="column is-11">
                        <label>Adjuntos</label><br />
                        <input name="adjuntos" id="adjuntos" type="file" aria-label="files" />
                        <div id="listViewAttachment"></div>
                    </div>
                    <div class="column is-11">
                        <br />
                        <div style="display: flex; align-items: center;">${Continuidad}<span style="font-size: 18px;">&nbsp; ¿Proyecto de Continuidad?</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Beneficios -->
        <div class="edit-container">
            <div class="columns">
                <div class="column is-6">
                    <label style="color: gray; font-size: 15px;">PUNTUACIÓN BENEFICIOS</label>
                    <br />
                    <div class="columnsBeneficio">
                        <div class="column is-11">
                            <span class="required-icon">*</span>
                            ${ReduccionCostos}
                            <span class="k-invalid-msg" data-for="ReduccionCostos"></span>
                        </div>

                        <div class="column is-11">
                            <span class="required-icon">*</span>
                            ${AumentoVentas}
                            <span class="k-invalid-msg" data-for="AumentoVentas"></span>
                        </div>
                                    
                        <div class="column is-11">
                            <span class="required-icon">*</span>
                            ${IncrementoServicio}
                            <span class="k-invalid-msg" data-for="IncrementoServicio"></span>
                        </div>

                        <div class="column is-11">
                            <span class="required-icon">*</span>
                            ${CumplimientoNormativo}
                            <span class="k-invalid-msg" data-for="CumplimientoNormativo"></span>
                        </div>

                        <!--<div id="radio-md"><br>
                            
                            <legend class="label" id="labelapprovers"><span class="required-icon">*</span> Proyecto de Innovación</legend>
                            <div class="content-radio">
                                <input validationMessage="Este campo es obligatorio" type="radio" class="k-radio" id="innovacion1" name="innovacion" value="innovacion1" required="true">
                                <label for="innovacion1">No es un proyecto de innovación</label><br>
                            </div>
                            
                            <div class="content-radio">
                                <input validationMessage="Este campo es obligatorio" type="radio" class="k-radio" id="innovacion2" name="innovacion" value="innovacion2" required="true">
                                <label for="innovacion2">Es un proyecto de innovación</label><br>
                            </div>

                            <span class="k-invalid-msg" data-for="CumplimientoNormativo"></span>
                        </div>-->
                    </div>
                </div>

                <div class="column is-6">
                    <label style="color: gray; font-size: 15px;">PUNTUACIÓN ESFUERZOS</label>
                    <div class="columnsBeneficio">
                        <div class="column is-11">
                            <span class="required-icon">*</span>
                            ${EsfuerzoEnTiempo}
                            <span class="k-invalid-msg" data-for="EsfuerzoEnTiempo"></span>
                        </div>
                                
                        <div class="column is-11">
                            <span class="required-icon">*</span>
                            ${EsfuerzoEnCostos}
                            <span class="k-invalid-msg" data-for="EsfuerzoEnCostos"></span>
                        </div>
                    </div>

                    <br />
                    <!--<button class="button" id="setPuntuacion">Guardar Puntuación</button>-->
                </div>
            </div>
        </div>

        <!-- General -->
        <div class="edit-container">
            <div class="columns">
                <div class="column is-6">
                                
                    <!--<div class="column is-11">
                        <span class="required-icon">*</span>
                        ${TipoBeneficio}
                        <span class="k-invalid-msg" data-for="TipoBeneficio"></span>
                    </div>-->
                                
                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${Coordinacion}
                        <span class="k-invalid-msg" data-for="Coordinacion"></span>
                    </div>
                    
                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${ComentariosEvaluacion}
                        <span class="k-invalid-msg" data-for="ComentariosEvaluacion"></span>
                    </div> 
                </div>      
                            
                <div class="column is-6">

                    <div class="column is-11">
                        <span class="required-icon">*</span>
                        ${AnalistaAsignado}
                        <span class="k-invalid-msg" data-for="AnalistaAsignado"></span>
                    </div>
                            
                    <br />

                    <div id="promoteContent" class="column is-7">
                        <label>Promover a Project Online</label>
                        <fieldset class="box box-promover">
                            <button id="btnPromover"><span class="k-icon k-i-filter-add-group"></span></button>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>


        <div class="edit-container" id="historico">
            
            <fieldset class="box">
                <label style="color: gray; margin-bottom: 10px !important;">HISTORICO DE PUNTUACIÓN BENEFICIO</label>
                <div style="margin-top: 10px !important;" id="gridHistorico"></div>
            </fieldset>

            <fieldset class="box">
                <label style="color: gray; margin-bottom: 10px !important;">HISTORICO DE PUNTUACIÓN ESFUERZO</label>
                <div style="margin-top: 10px !important;" id="gridHistoricoBeneficio"></div>
            </fieldset>
        </div>

    </div>
  

    <div id ="load"><div> 
    `;

}