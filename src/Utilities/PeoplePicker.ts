interface IPeoplePickerPayload {
    id: string;
    model: any;
    schema: ISPClientPeoplePickerSchema;
    validator?: kendo.ui.Validator;
    value?: string;
    required: boolean;
  }
  import { sp } from "@pnp/sp/presets/all";

async function validate(key: string): Promise<number> {
    if (typeof key === "undefined" || !key) { return null; }
    let siteUser: SiteUser;
    try {
      siteUser = await sp.web.siteUsers.getByLoginName(key).get();
      if (siteUser.Id) { return siteUser.Id }
    } catch (err) {
      siteUser = await sp.web.siteGroups.getById(612).users.add(key);
      if (siteUser) {
        const userInfo = await siteUser.select("Id").get();
        return userInfo.Id;
      }
    }
}

const { InitializeStandalonePeoplePicker, SPClientPeoplePickerDict } = SPClientPeoplePicker;

export class PeoplePicker {
  public client: SPClientPeoplePicker;
  private model: any;
  private properties: any;
  private required: boolean;
  private validator: kendo.ui.Validator;
  private value: string;

  static getClient (id: string): SPClientPeoplePicker {
    return SPClientPeoplePickerDict[`${id}_TopSpan`];
  }

  constructor(payload: IPeoplePickerPayload) {
    const {id, schema, validator, model, value, required} = payload;
    this.value = value;

    this.properties = {};
    this.properties[`${value}Id`] = null;
    this.properties[`${value}StringId`] = null;

    this.model = Object.assign(model, this.properties);

    this.validator = validator;

    InitializeStandalonePeoplePicker(id, null, schema);
    this.client = SPClientPeoplePickerDict[`${id}_TopSpan`];
    // Eventos
    this.client.OnUserResolvedClientScript = this.resolved.bind(this);
    this.client.OnValueChangedClientScript = this.changed.bind(this);
    
    if (required) {
      document.getElementById(this.client.HiddenInputId).setAttribute("required", "");
    }
    document.getElementById(`${id}_TopSpan`).classList.add("input");
  }

  private resolved(elementId: string, users: ISPClientPeoplePickerEntity[]) {
    const input = document.getElementById(this.client.HiddenInputId);
    const { value } = this;
    this.model[`${value}Id`]  = {results:[]};
    this.model[`${value}StringId`] = {results:[]};
    users.forEach(async (user) => {
      if (user.IsResolved) {
        try {
          const id = await validate(user.Key);
          this.model[`${value}Id`].results.push(id);
          this.model[`${value}StringId`].results.push(id.toString());
          input.value = {};
          this.validator.validateInput(input);
          this.model.dirty = true;
        } catch (err) {
          // No se pudo validar el usuario
          console.log("error validando:" + user.DisplayText);
        }
      }
    });
    if (users.length === 0) {
      this.model[`${value}Id`]  = null;
      this.model[`${value}StringId`] = null;
    }
  }

  private changed(elementId: string, users: ISPClientPeoplePickerEntity[]) {
    const input = document.getElementById(this.client.HiddenInputId);
    const { value } = this;
    // Si no hay usuarios resueltos en el componente, ponemos el requerido con kendo
    if (users.length < 1) {
      input.value = "";
    // Si hay más de dos usarios en el control y solo se permite uno, el modelo no es valido
    } else if (users.length > 1 && !this.client.AllowMultipleUsers) {
      input.value = "";
    }
    if (users.length == 1 && this.model[`${value}Id`] == null) {
      input.value = "";
    }
    if (this.validator) {
      this.validator.validateInput(input);
    }
  }

  public isRequied(required: boolean): void {
    if (required) {
      document.getElementById(this.client.HiddenInputId).setAttribute("required", "");
    } else {
      document.getElementById(this.client.HiddenInputId).removeAttribute("required");
    }
  }

  public enable(enable: boolean):void {
    if (enable) {
      $(".sp-peoplepicker-delImage").show();
      $(`#${this.client.EditorElementId}`).removeProp("disabled");
      $(`#${this.client.TopLevelElementId}`).toggleClass("sp-peoplepicker-topLevelDisabled");
      $(`#${this.client.TopLevelElementId}`).removeAttr("disabled");
    } else {
      $(".sp-peoplepicker-delImage").hide();
      $(`#${this.client.EditorElementId}`).prop("disabled", true);
      $(`#${this.client.TopLevelElementId}`).toggleClass("sp-peoplepicker-topLevelDisabled");
      $(`#${this.client.TopLevelElementId}`).attr("disabled", "");
    }
  }

  public clear(): void {
    const resolvedUsers = $(document.getElementById(this.client.ResolvedListElementId))
      .find("span[class='sp-peoplepicker-userSpan']");
    $(resolvedUsers).each((index, element) => {
      this.client.DeleteProcessedUser(element);
    });
  }
}