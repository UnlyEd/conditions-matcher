export default interface ICheckError {
  'status': boolean | null,
  'conditionalOperator': any,
  'value'?: any,
  'contextValue'?: any,
  'flags': any,
  'reason': string,
  'target'?: any
}
