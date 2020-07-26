import { Command } from "./Command";
import Field from "./Field";

interface SetFieldStateCommandPayload {
  fieldIndex: number;
}
export const SET_FIELD_STATE_COMMAND_NAME = 'setFieldState';

class SetFieldStateCommand implements Command<Field, SetFieldStateCommandPayload> {
  public readonly name: string = SET_FIELD_STATE_COMMAND_NAME;
  private payload: SetFieldStateCommandPayload;
  
  public constructor(payload: SetFieldStateCommandPayload) {
    this.payload = payload;
  }

    // 0 1 2
    // 3 4 5
    // 6 7 8
  public execute(field: Field): void {
    const { fieldIndex } = this.payload;
    if (!field.isFieldIndexValid(fieldIndex)) {
      console.debug(`index: ${fieldIndex} is not active or invalid`);
      return;
    }

    const neighboursIndexes = this.getNeighboursIndexes(field, fieldIndex);

    neighboursIndexes.forEach((index) => {
      field.toggleItemState(index);
    });

    field.toggleItemState(fieldIndex);
  }

  private getNeighboursIndexes(field: Field, index: number) {
    const size = field.size;
    /*  
      if current index is 4
      and size of field is 3
        1
      3 4 5
        7 
    */
    const neighbours: number[] = [
      // left
      (index % size === 0) ? -1 : index - 1,
      // top 
      index - size,
      // right 
      (index % size === size - 1) ? -1 : index + 1,
      // bottom 
      index + size];

    // check that neighbors are in bounds
    const validNeighnours = neighbours.filter(it => (it >= 0) && (it < field.length));

    return validNeighnours;
  }
}

export default SetFieldStateCommand;
