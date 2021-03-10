
import { PromoteController } from "../Controller/PromoteController"


export namespace PromoteBl {


    export async function getContextInfoPWA(){

        return await PromoteController.getContextInfoPWA();

    }

    export async function createProject(objRegistro,FormDigestValue){
        return await PromoteController.createProject(objRegistro,FormDigestValue);
    }

    export async function checkOutProject(idPro,FormDigestValue){
        return await PromoteController.checkOutProject(idPro,FormDigestValue);
    }

    export async function checkInProject(idPro,FormDigestValue){
        return await PromoteController.checkInProject(idPro,FormDigestValue);
    }

    export async function updateCustomFields(idPro,FormDigestValue,objCustomFields){
        return await PromoteController.updateCustomFields(idPro,FormDigestValue,objCustomFields);
    }

    export async function getProject(idPro,FormDigestValue){
        return await PromoteController.getProject(idPro,FormDigestValue);
    }

    

    export async function getEnterpriseProjectTypes(){

        return new Promise(async (resolve, reject) => {

            let result = await getContextInfoPWA();
            let context = await result.json();
            let FormDigestValue = context.d.GetContextWebInformation.FormDigestValue;
            let results = await PromoteController.getEnterpriseProjectTypes(FormDigestValue);
            let data = await results.json();
            resolve(data.d.results);

        });

    }
    


}