export const enum Token {
  BooleanLiteral = 1,
  EOF,
  Identifier,
  Keyword,
  NullLiteral,
  NumericLiteral,
  Punctuator,
  StringLiteral,
  RegularExpression,
  Template
}

export const TokenName = {
  [Token.BooleanLiteral]: 'Boolean',
  [Token.EOF]: '<end>',
  [Token.Identifier]: 'Identifier',
  [Token.Keyword]: 'Keyword',
  [Token.NullLiteral]: 'Null',
  [Token.NumericLiteral]: 'Numeric',
  [Token.Punctuator]: 'Punctuator',
  [Token.StringLiteral]: 'String',
  [Token.RegularExpression]: 'RegularExpression',
  [Token.Template]: 'Template'
};
