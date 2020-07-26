import GameStateManager from "./GameStateManager";

import { createInterface, Interface } from 'readline';
import { SET_FIELD_STATE_COMMAND_NAME } from "./SetFieldStateCommand";
import { exit } from "process";
class ConsoleUI {

  private rl: Interface;
  private gameStateManager: GameStateManager;

  constructor() {
    this.gameStateManager = new GameStateManager();
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
  }

  public async startGameLoop(): Promise<void> {
    console.log('game is about to begin');
    this.gameStateManager.startGame();
    this.printField();
    while (!this.gameStateManager.isGameFinished()) {
      try {
        const result = await this.promtForOption();
        this.gameStateManager.fireAction({
          name: SET_FIELD_STATE_COMMAND_NAME,
          params: {
            fieldIndex: result,
          }
        });
        this.printField();
      } catch (e) {
        console.error(e);
      } 
    }

    console.log('game is finished');
    exit(0);
  }

  public printField(): void {
    const { field } = this.gameStateManager.getState();
    
    const stateCopy = [...field.state];
    let index = 0;
    while (index * field.size < field.length) {
      console.log(
        ...stateCopy.slice(index * field.size, (index + 1) * field.size)
      );
      index += 1;
    }
  }

  private async promtForOption() {
    return new Promise((resolve, reject) => {
      this.rl.question('your move?\n', (answer) => {
        try {
          resolve(parseInt(answer));
        } 
        catch(e) {
          reject(answer);
        }
      });
    });
  }
}

export default ConsoleUI;
