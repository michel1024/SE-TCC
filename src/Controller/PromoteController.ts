import { urls } from "../Utilities/utils";



export namespace PromoteController {


    export async function getContextInfoPWA():Promise<Response> {

        return await fetch(urls.PWA + "/_api/contextinfo", {
            method: "POST",
            headers: new Headers({
                "Accept": "application/json; odata=verbose"
            })
        });

    }

    export async function createProject(objRegistro,FormDigestValue){


        return await fetch(urls.PWA + "/_api/ProjectServer/Projects/Add", {
            method: "POST",
            body: JSON.stringify(objRegistro),
            headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
            })
        });
    }

    export async function checkOutProject(idPro,FormDigestValue){


        return await fetch(`${urls.PWA}/_api/ProjectServer/Projects('${idPro}')/checkOut()`, {
            method: "POST",
            headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
            })
        });
        
    }

    export async function getProject(idPro,FormDigestValue){


        return await fetch(`${urls.PWA}/_api/ProjectData/Proyectos(guid'${idPro}')`, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
            })
        });
        
    }

    export async function checkInProject(idPro,FormDigestValue){
        
        return await fetch(`${urls.PWA}/_api/ProjectServer/Projects('${idPro}')/Draft/publish(true)`, {
            method: "POST",
            headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
            })
        });
    }

    export async function updateCustomFields(idPro,FormDigestValue,objCustomFields){
        
        return await fetch(`${urls.PWA}/_api/ProjectServer/Projects('${idPro}')/Draft/UpdateCustomFields`, {
			method: "POST",
			body: JSON.stringify(objCustomFields),
			headers: new Headers({
				"Accept": "application/json; odata=verbose",
				"X-RequestDigest": FormDigestValue,
				"Content-Type": "application/json;odata=verbose"
			})
		});
    }

    

    export async function getEnterpriseProjectTypes(FormDigestValue){

        return await fetch(urls.PWA + "/_api/ProjectServer/EnterpriseProjectTypes", {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
            })
        });
    }


}