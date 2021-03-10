import { urls } from "../Utilities/utils"

export function getTemplateUser(item): string {
    return `
    <div class="divMB">
        <img alt="User" id="imgMB" src="${urls.site}/ReqIntegrados/_layouts/15/userphoto.aspx?size=M&username=${item.Aprobador.EMail}" style="display: inline;">
    </div>
    <div class="divMB">
        ${item.Aprobador.Title}   
    </div>
    `;
}



export function getTemplateDialog(item): string {
    return `
    
        <form id="formConf">
            <div class="se-content">
                <p>¿Desea provomer la iniciativa <b>${item.NombreOportunidad}</b>?</p>
                <div style="text-align: center;">
                    <input id='tipoProyecto' style="width:250px" required />
                </div>
            </div>  
            <div class="se-footer">
                <button class="k-button k-button-icontext k-primary k-grid-update" id="yesButton">Promover</button>
                <button class="k-button" id="noButton">Cancelar</button>
            </div>            
        </form>
    `;

}
