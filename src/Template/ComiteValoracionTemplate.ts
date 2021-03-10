import { ui } from "../Utilities/utils";



const { renderFieldDetail } = ui;

const Encargado = renderFieldDetail({ id: "Encargado", className: "input", title: "Encargado", type: "input", name: "Encargado", others: "", value: "Encargado" })
const Estado = renderFieldDetail({ id: "Estado", className: "input", title: "Estado", type: "input", name: "Estado", others: "", value: "Estado" })
const Comentario = renderFieldDetail({ id: "Comentario", className: "input textarea", title: "Comentario", type: "textarea", name: "Comentario", others: "", value: "Comentario" })



/**
 * Funcion que pemite devolver un String 
 */
export function getTemplate(): string {
    return `
    <div class="tabstrip-valoracion" id="tabstrip">
        <ul>
            <li class="k-state-active"></li>
        </ul>


        <div class="edit-container"><br>
            <div class="columns">
                <div class="column is-6">
                    <div class="column is-10">
                        ${Encargado}
                        <span class="k-invalid-msg" data-for="Patrocinador"></span>
                    </div>

                    <div class="column is-10">
                        <fieldset class = "box"id = "boxApprover">
                            <div id="radio-md">
                                <legend class="label">Estado Valoración</legend>
                                <div class="content-radio">
                                    <input type="radio" class="k-radio" id="aprobado" name="gender1" value="aprobado">
                                    <label for="aprobado">Aprobado</label><br>
                                </div>
                                
                                <div class="content-radio">
                                    <input type="radio" class="k-radio" id="rechazado" name="gender1" value="rechazado">
                                    <label for="rechazado">Rechazado</label><br>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div class="column is-6">

                    <div class="column is-10">
                        ${Comentario}
                        <span class="k-invalid-msg" data-for="Patrocinador"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  

    <div id ="load"></div> 
    `;

}