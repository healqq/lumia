export interface Command<TEntity, TPayload> {
  name: string;
  execute: (entity: TEntity) => void;
}
