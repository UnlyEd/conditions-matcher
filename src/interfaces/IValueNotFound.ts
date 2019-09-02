export default interface IValueNotFound {
  'status': boolean | null,
  'rule'?: string,
  'conditionalOperator': any,
  'complex_operator'?: any,
  'path': any,
  'valueInContext': any,
  'reason': string,
}
