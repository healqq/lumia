import Field, { FieldLayoutKind, FieldItemState, FieldState } from "./Field";
import FieldDispatcher from "./FieldDispatcher";
import SetFieldStateCommand, { SET_FIELD_STATE_COMMAND_NAME } from "./SetFieldStateCommand";

interface ActionPayload {
  name: string;
  params: Record<any, any>;
}

enum GameState {
  // 0
  IDLE,
  // 1
  IN_PROGRESS,
  // 2
  FINISHED,
}

class GameStateManager {

  private gameState: GameState = GameState.IDLE;

  private field: Field;

  private dispatcher: FieldDispatcher;

  constructor() {
    const layout = [
      // 0                              1                     2
      FieldLayoutKind.NORMAL, FieldLayoutKind.NORMAL, FieldLayoutKind.NORMAL,
      // 3                              4                     5
      FieldLayoutKind.NORMAL, FieldLayoutKind.EMPTY, FieldLayoutKind.NORMAL,
      // 6                              7                     8
      FieldLayoutKind.NORMAL, FieldLayoutKind.NORMAL, FieldLayoutKind.NORMAL,
    ];

    this.field = new Field(layout);
    this.dispatcher = new FieldDispatcher();
  }

  public startGame(): void {
    this.gameState = GameState.IN_PROGRESS;
  }

  public isGameFinished(): boolean {
    return this.field.getState().isFinished;
  }

  public fireAction(action: ActionPayload): void {
    let command;
    switch (action.name) {
      case SET_FIELD_STATE_COMMAND_NAME: 
        command = new SetFieldStateCommand({ fieldIndex: action.params.fieldIndex});
    }

    if (command) {
      this.dispatcher.dispatch(this.field, command);
    }

    if (this.isGameFinished()) {
      this.gameState = GameState.FINISHED;
    }
  }

  public getState(): { gameState: GameState, field: FieldState & { size: number, length: number } } {
    return {
      gameState: this.gameState,
      field: {
        ...this.field.getState(),
        size: this.field.size,
        length: this.field.length,
      },
    }
  }
 }

export default GameStateManager;
