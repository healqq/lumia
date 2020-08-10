export enum FieldLayoutKind {
  EMPTY,
  NORMAL
}

export enum FieldItemState {
  // 0
  NOT_ACTIVE,
  // 1
  ACTIVE,
}

export type FieldState = { 
  layout: FieldLayoutKind[], 
  state: FieldItemState[], 
  isFinished: boolean 
};

class Field {
  private fieldLayout: FieldLayoutKind[];
  private fieldState: FieldItemState[];
  public size: number;
  public length: number;

  constructor(layout: FieldLayoutKind[]) {

    this.fieldLayout = layout;
    this.fieldState = this.getDefaultFieldState();
    this.size = Math.sqrt(this.fieldLayout.length);
    this.length = this.fieldLayout.length;
  }

  public setItemState(index: number, state: FieldItemState):void {
    if (this.isFieldIndexValid(index)) {
      this.fieldState[index] = state;
    }  
  }

  public toggleItemState(index: number): void {
    if (this.isFieldIndexValid(index)) {
      this.fieldState[index] = +!this.fieldState[index];
    }
  }

  public isFieldIndexValid(fieldIndex: number): boolean {
    if (!this.fieldLayout[fieldIndex]) {
      return false;
    }

    if (this.fieldLayout[fieldIndex] === FieldLayoutKind.EMPTY) {
      return false;
    }

    return true;
  }

  private getDefaultFieldState() {
    const fieldState = new Array(this.fieldLayout.length);
    fieldState.fill(FieldItemState.NOT_ACTIVE);
    fieldState[1] = FieldItemState.ACTIVE;
    fieldState[7] = FieldItemState.ACTIVE;
    return fieldState;
  }

  public reset(): void {
    this.fieldState = this.getDefaultFieldState();
  }

  public getState(): FieldState {
    const isFinished = this.fieldLayout.every((item: FieldLayoutKind, index: number) => {
      return (item === FieldLayoutKind.EMPTY) 
        || (this.fieldState[index] === FieldItemState.ACTIVE);
    });
    return {
      layout: this.fieldLayout,
      state: this.fieldState,
      isFinished,
    }
  }
}

export default Field;
