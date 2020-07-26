import ConsoleUI from "./ConsoleUI";

class Application {
 private ui: ConsoleUI;

  constructor() {
    this.ui = new ConsoleUI();
  }

  public start(): void {
    this.ui.startGameLoop();
  }

}

export default Application;
