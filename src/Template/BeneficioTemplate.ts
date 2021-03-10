import { ui } from "../Utilities/utils";



const { renderFieldDetail } = ui;

const BeneficioCosto = renderFieldDetail({ id: "BeneficioCosto", className: "input dropdown", title: "Beneficio Costo", type: "input", name: "BeneficioCosto", others: "", value: "BeneficioCostoId" })
const AumentoVentas = renderFieldDetail({ id: "AumentoVentas", className: "input dropdown", title: "Aumento Ventas ", type: "input", name: "AumentoVentas", others: "", value: "AumentoVentasId" })
const NivelDeServicio = renderFieldDetail({ id: "NivelDeServicio", className: "input dropdown", title: "Nivel De Servicio", type: "input", name: "NivelDeServicio", others: "", value: "NivelDeServicioId" })
const Normativo = renderFieldDetail({ id: "Normativo", className: "input dropdown", title: "Normativo ", type: "input", name: "Normativo", others: "", value: "NormativoId" })
const Innovacion = renderFieldDetail({ id: "Innovacion", className: "input dropdown", title: "Innovacion", type: "input", name: "Innovacion", others: "", value: "InnovacionId" })
const EsfuerzoTiempo = renderFieldDetail({ id: "EsfuerzoTiempo", className: "input dropdown", title: "Esfuerzo Tiempo ", type: "input", name: "EsfuerzoTiempo", others: "", value: "EsfuerzoTiempoId" })
const EsfuerzoCostos = renderFieldDetail({ id: "EsfuerzoCostos", className: "input dropdown", title: "Esfuerzo Costos ", type: "input", name: "EsfuerzoCostos", others: "", value: "EsfuerzoCostosId" })
const Beneficio = renderFieldDetail({ id: "Beneficio", className: "input", title: "Beneficio ", type: "input", name: "Beneficio", others: "validationMessage='Este campo es obligatorio'", value: "Beneficio" })
const ReduccionCostos = renderFieldDetail({ id: "ReduccionCostos", className: "input dropdown", title: "Beneficio - Reducción de costos", type: "input", name: "ReduccionCostos", others: "validationMessage='Este campo es obligatorio'", value: "ReduccionCostosId" })
const TipoBeneficio = renderFieldDetail({ id: "TipoBeneficio", className: "input dropdown", title: "Tipo de beneficio", type: "input", name: "TipoBeneficio", others: "validationMessage='Este campo es obligatorio'", value: "TipoBeneficioId" })
const BeneficioEstimadoServicio = renderFieldDetail({ id: "BeneficioEstimadoServicio", className: "input dropdown", title: "Beneficio Estimado Servicio", type: "input", name: "BeneficioEstimadoServicio", others: "validationMessage='Este campo es obligatorio'", value: "BeneficioEstimadoServicioId" })
const BeneficioVenta = renderFieldDetail({ id: "BeneficioVenta", className: "input dropdown", title: "Beneficio Venta", type: "input", name: "BeneficioVenta", others: "validationMessage='Este campo es obligatorio'", value: "BeneficioVentaId" })



/**
 * Funcion que pemite devolver un String 
 */
export function getTemplate(): string {
    return `
    <div id="tabstripBeneficio">
        <ul>
            <li class="k-state-active"></li>
        </ul>


        <div class="edit-container beneficios"><br>
            <div class="columns">
                <div class="column is-6">
                    <label style="color: gray; font-size: 15px;">PUNTUACIÓN BENEFICIOS</label>
                    <br />
                    <div class="columnsBeneficio">
                        <div class="column is-10">
                            ${ReduccionCostos}
                            <span class="k-invalid-msg" data-for="Patrocinador"></span>
                        </div>

                        <div class="column is-10">
                            ${AumentoVentas}
                            <span class="k-invalid-msg" data-for="Title"></span>
                        </div>
                                    
                        <div class="column is-10">
                            ${NivelDeServicio}
                            <span class="k-invalid-msg" data-for="AreaSolicitante"></span>
                        </div>

                        <div class="column is-10">
                            ${Innovacion}
                            <span class="k-invalid-msg" data-for="PublicoImpactado"></span>
                        </div>
                    </div>

                    <div class="column is-10">
                        ${Beneficio}
                        <span class="k-invalid-msg" data-for="AreaSolicitante"></span>
                    </div>

                    <div class="column is-10">
                        ${TipoBeneficio}
                        <span class="k-invalid-msg" data-for="PublicoImpactado"></span>
                    </div>
                </div>

                <div class="column is-6">
                    <label style="color: gray; font-size: 15px;">PUNTUACIÓN ESFUERZOS</label>
                    <div class="columnsBeneficio">
                        <div class="column is-10">
                            ${EsfuerzoTiempo}
                            <span class="k-invalid-msg" data-for="TiempoEstimado"></span>
                        </div>
                                
                        <div class="column is-10">
                            ${EsfuerzoCostos}
                            <span class="k-invalid-msg" data-for="Patrocinador"></span>
                        </div>
                    </div>

                    <div class="column is-10">
                        ${Normativo}
                        <span class="k-invalid-msg" data-for="Patrocinador"></span>
                    </div>

                    <div class="column is-10">
                        ${BeneficioEstimadoServicio}
                        <span class="k-invalid-msg" data-for="Patrocinador"></span>
                    </div>

                    <div class="column is-10">
                        ${BeneficioVenta}
                        <span class="k-invalid-msg" data-for="Patrocinador"></span>
                    </div>

                    <div class="column is-10">
                        ${BeneficioCosto}
                        <span class="k-invalid-msg" data-for="Patrocinador"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  

    <div id ="load"></div> 
    `;

}