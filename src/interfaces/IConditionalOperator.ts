export default interface IConditionalOperator {
  readonly alias: string[];
  humanlyReadableAs: string;

  callback(value: any, contextValue?: any, flags?: string[]): boolean;
}
