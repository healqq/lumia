import RestUI from "./RestUI";

class RestApplication {
 private ui: RestUI;

  constructor() {
    this.ui = new RestUI();
  }

  public start(): void {
    this.ui.startServer();
  }

}

export default RestApplication;
