import Editor from "./editor";
export default class CheckBox extends Editor {
  _useTemplates() {
    return false;
  }

  getSupportedKeyNames() {
    return ["space"];
  }

}