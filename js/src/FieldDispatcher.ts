import Field from "./Field";
import { Command } from "./Command";

class FieldDispatcher {

  public dispatch(field: Field, command: Command<Field, any>): void {
    console.debug(`dispatching ${command.name}`);
    command.execute(field);
  }

}

export default FieldDispatcher;
