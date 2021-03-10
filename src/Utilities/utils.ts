import { sp } from "@pnp/sp/presets/core";

let config = {
headers: {
["accept"]:"application/json;odata=nometadata"
    }
}


export namespace urls {
  export const site = _spPageContextInfo.siteServerRelativeUrl;
  export const PWA = "https://tccbpos.sharepoint.com/sites/pwa"

}


export namespace customFielPWA {
  export const fields = [
    { id: "42de966a-fa8d-e911-b079-00155d603a3b", type: "String", campo: "Estado Proyecto", lookup: [] },

    { id: "c08bc7c2-bc8b-e911-b083-00155d682b16", type: "String", campo: "Unidad Negocio", lookup: [
      {value: "Paquetería", key: "328f1671-bc8b-e911-b082-00155d689230"},
      {value: "Mensajería", key: "338f1671-bc8b-e911-b082-00155d689230"},
    ]}
  ]
}



export namespace lists {
    export const Iniciativas = sp.web.lists.getById("1A9D7F85-A890-40A5-AAAC-B75FD53DD62D");
    Iniciativas.configure(config);

    export const MetaData = sp.web.lists.getById("3763F83B-5D11-4251-81C6-355CD8D89729");
    MetaData.configure(config);

    export const Puntaje = sp.web.lists.getById("0A7270B3-CC69-4138-9746-2CAD960DAF06");
    Puntaje.configure(config);

    export const Historico = sp.web.lists.getById("5B2737F2-BC7F-42A8-9B61-5ECFE5540762");
    Historico.configure(config);

    export const HistoricoEsfuerzo = sp.web.lists.getById("6BB91741-6C6E-4651-901B-69188C9CE9DB");
    HistoricoEsfuerzo.configure(config);

    export const ComiteValoracion = sp.web.lists.getById("2608abb3-ec5b-435b-b4b9-4500ad427cfd");
    ComiteValoracion.configure(config);

    export const ComiteValoracion1 = sp.web.lists.getById("b2ae66c3-c0fd-4e5f-8496-a5b172cc85bc");
    ComiteValoracion1.configure(config);

    export const ComiteValoracion2 = sp.web.lists.getById("C08D86C4-2FEE-486A-8EB5-A39DB175CEFE");
    ComiteValoracion2.configure(config);

    export const EquipoProductividad = sp.web.lists.getById("5b416733-d5fc-4d0e-a37d-a92d72d663b7");
    EquipoProductividad.configure(config);

    export const EquipoProyectos = sp.web.lists.getById("21a81907-776e-4693-b865-e9476f609f2d");
    EquipoProyectos.configure(config);


    export const EncargadosComite = sp.web.lists.getById("6ec10dd3-4f78-4ae1-a15a-e80ee06449e5");
    EncargadosComite.configure(config);

    export const GrupoIniciativas = sp.web.lists.getById("c0f99104-f4bf-4f92-96ab-0a6b9edd6e1f");
    GrupoIniciativas.configure(config);
}

export namespace ui {

    export declare interface IFieldPayload {
        className?: string;
        id?: string;
        name?: string;
        required?: boolean;
        title: string;
        type: string;
        value?: string;
        readonly?:string;
        others?:string;
        classTitle?:string;
        checkBox?:boolean;
      }

    export function renderFilterField(parameters:IFieldPayload): string {
        const { title, value, type, id, className, required, name, readonly,others,classTitle } = parameters;
        return `
            <label class="label ${classTitle}">${title}</label>
            <div class="control">
              <${type} id="${id || ""}" name="${name}" class="${className || ""}" data-bind="value: ${value}" ${required ? "required" : ""} ${readonly ? readonly : ""} ${others ? others : ""}></${type}>
            </div>
        `;
    }

    export function renderFilterCheckField(parameters:IFieldPayload): string {
      const { title, value, type, id, className, required, name, readonly,others,classTitle } = parameters;
      return `
          <label class="label ${classTitle}">${title}</label>
          <div class="control">
            <${type} id="${id || ""}" name="${name}" class="item-55 ${className || ""}" data-bind="value: ${value}" ${required ? "required" : ""} ${readonly ? readonly : ""} ${others ? others : ""}></${type}>
            <div class="is-inline">
                <input type="checkbox" id="filterCheck${id}" class="k-checkbox">
                <label class="k-checkbox-label" for="filterCheck${id}">Contain</label>
            </div>
          </div>
      `;
    }

    export function renderFieldDetail(parameters:IFieldPayload): string {
      const { title, value, type, id, className, required, name, others,classTitle } = parameters;
      return `
          <label>${title}</label>
          <div class="control">
            <${type} id="${id || ""}" name="${name}" class="${className || ""}" data-bind="value: ${value}" ${required ? "required" : ""} ${others ? others : ""}></${type}>
          </div>
      `;
    }

    export function renderFieldCheckbox(parameters:IFieldPayload, parameters2:IFieldPayload): string {
      const { title, value, type, id, className, required, name, others,classTitle } = parameters;
      return `
          <label>${title}</label>
          <div class="control">
            <${type} id="${id || ""}" name="${name}" class="${className || ""}" data-bind="value: ${value}" ${required ? "required" : ""} ${others ? others : ""}></${type}>
          </div>
      `;
    }

    export function renderFieldSwitch(parameters:IFieldPayload): string {
      const { title, value, type, id, className } = parameters;
      return `
          <label>${title}</label>
          <div class="control">
            <${type} id="${id || ""}" name="${name}" class="${className || ""}" data-bind="value: ${value}"></${type}>
          </div>
      `;
  }
}