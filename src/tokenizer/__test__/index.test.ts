import lexer from '../lexer';
describe('lexer', () => {
  it('shoule identify keywords', () => {
    const input = 'const a = 1';
    lexer.start(input);
    const output = [
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' }
    ];
    expect(lexer.DFA.result.tokens).toStrictEqual(output);
  });

  it('should identify operators', () => {
    const input = 'const a = 1; a = 1 + 2;';
    lexer.start(input);
    expect(lexer.DFA.result.tokens).toStrictEqual([
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' },
      { type: 'Operator', value: '+' },
      { type: 'Number', value: '2' },
      { type: 'Symbol', value: ';' }
    ]);
  });

  it('should identify doubel opeators', () => {
    const input = 'const a = 1; const b = a >> 1;';
    lexer.start(input);
    expect(lexer.DFA.result.tokens).toStrictEqual([
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'b' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'a' },
      { type: 'DoubleOperator', value: '>>' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' }
    ]);
  });
});
