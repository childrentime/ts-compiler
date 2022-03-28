import tokenizer from '../';
import path from 'path';
import fs from 'fs';

describe('lexer', () => {
  it('shoule identify keywords', () => {
    const input = 'const a = 1';
    const tokens = tokenizer(input);
    const output = [
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' }
    ];
    expect(tokens).toStrictEqual(output);
  });

  it('should identify operators', () => {
    const input = 'const a = 1; a = 1 + 2;';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
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
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
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

  it('should indentify linefeed', () => {
    const input = 'var a = 1;\nconsole.log(a)';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'var' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'console' },
      { type: 'Symbol', value: '.' },
      { type: 'Identifier', value: 'log' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'a' },
      { type: 'Symbol', value: ')' }
    ]);
  });

  it('should indentify and opeator', () => {
    const input = '>>';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([{ type: 'DoubleOperator', value: '>>' }]);
  });

  it('should indentify float number', () => {
    const input = 'return 0.2224322432;';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'return' },
      { type: 'Float', value: '0.2224322432' },
      { type: 'Symbol', value: ';' }
    ]);
  });

  it('should indentify bit operators', () => {
    const input = 'const a = b^2;const a = b~2;';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'b' },
      { type: 'Operator', value: '^' },
      { type: 'Number', value: '2' },
      { type: 'Symbol', value: ';' },
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'b' },
      { type: 'Operator', value: '~' },
      { type: 'Number', value: '2' },
      { type: 'Symbol', value: ';' }
    ]);
  });

  it('should indentify string  literals', () => {
    const input = 'const a = "1"';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'String', value: '"1"' }
    ]);
  });

  it('should indentify char literals', () => {
    const input = "const a = '1'";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Char', value: "'1'" }
    ]);
  });

  it('should indentify symbol', () => {
    const input = '[][<>[]]][][[[][[]{]{}[}';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: '[' },
      { type: 'Operator', value: '<' },
      { type: 'Operator', value: '>' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: '{' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: '{' },
      { type: 'Symbol', value: '}' },
      { type: 'Symbol', value: '[' },
      { type: 'Symbol', value: '}' }
    ]);
  });

  it('should indentify double and', () => {
    const input = '&&';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([{ type: 'DoubleOperator', value: '&&' }]);
  });

  it('should indentify double or', () => {
    const input = '||';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([{ type: 'DoubleOperator', value: '||' }]);
  });

  it('should indentify lessthan', () => {
    const input = 'const a = 1;\nconst b= 2;\nlet c;\nif(a<=b){c=3}';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'a' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'const' },
      { type: 'Identifier', value: 'b' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '2' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'c' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'if' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'a' },
      { type: 'DoubleOperator', value: '<=' },
      { type: 'Identifier', value: 'b' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: '{' },
      { type: 'Identifier', value: 'c' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '3' },
      { type: 'Symbol', value: '}' }
    ]);
  });

  it('should indentify js code', () => {
    const input = fs.readFileSync(path.join(__dirname, './input.js'), 'utf-8');
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: 'Keyword', value: 'var' },
      { type: 'Identifier', value: 'findMedianSortedArrays' },
      { type: 'Operator', value: '=' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'nums1' },
      { type: 'Symbol', value: ',' },
      { type: 'Identifier', value: 'nums2' },
      { type: 'Symbol', value: ')' },
      { type: 'Operator', value: '=' },
      { type: 'Operator', value: '>' },
      { type: 'Symbol', value: '{' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'len1' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'nums1' },
      { type: 'Symbol', value: '.' },
      { type: 'Identifier', value: 'length' },
      { type: 'Symbol', value: ',' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'len2' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'nums2' },
      { type: 'Symbol', value: '.' },
      { type: 'Identifier', value: 'length' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'if' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'len1' },
      { type: 'Operator', value: '>' },
      { type: 'Identifier', value: 'len2' },
      { type: 'Symbol', value: ')' },
      { type: 'Keyword', value: 'return' },
      { type: 'Identifier', value: 'findMedianSortedArrays' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'nums2' },
      { type: 'Symbol', value: ',' },
      { type: 'Identifier', value: 'nums1' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'len' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'len1' },
      { type: 'Operator', value: '+' },
      { type: 'Identifier', value: 'len2' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'start' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '0' },
      { type: 'Symbol', value: ',' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'end' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'len1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Symbol', value: ',' },
      { type: 'Identifier', value: 'partLen2' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'while' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'start' },
      { type: 'DoubleOperator', value: '<=' },
      { type: 'Identifier', value: 'end' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: '{' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Operator', value: '=' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'start' },
      { type: 'Operator', value: '+' },
      { type: 'Identifier', value: 'end' },
      { type: 'Symbol', value: ')' },
      { type: 'DoubleOperator', value: '>>' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'partLen2' },
      { type: 'Operator', value: '=' },
      { type: 'Symbol', value: '(' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'len' },
      { type: 'Operator', value: '+' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ')' },
      { type: 'DoubleOperator', value: '>>' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ')' },
      { type: 'Operator', value: '-' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'L1' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'DoubleOperator', value: '==' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '0' },
      { type: 'Symbol', value: '?' },
      { type: 'Operator', value: '-' },
      { type: 'Identifier', value: 'Infinity' },
      { type: 'Symbol', value: ':' },
      { type: 'Identifier', value: 'nums1' },
      { type: 'Symbol', value: '[' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Operator', value: '-' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'L2' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'partLen2' },
      { type: 'DoubleOperator', value: '==' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '0' },
      { type: 'Symbol', value: '?' },
      { type: 'Operator', value: '-' },
      { type: 'Identifier', value: 'Infinity' },
      { type: 'Symbol', value: ':' },
      { type: 'Identifier', value: 'nums2' },
      { type: 'Symbol', value: '[' },
      { type: 'Identifier', value: 'partLen2' },
      { type: 'Operator', value: '-' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'R1' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'DoubleOperator', value: '==' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'len1' },
      { type: 'Symbol', value: '?' },
      { type: 'Identifier', value: 'Infinity' },
      { type: 'Symbol', value: ':' },
      { type: 'Identifier', value: 'nums1' },
      { type: 'Symbol', value: '[' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'let' },
      { type: 'Identifier', value: 'R2' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'partLen2' },
      { type: 'DoubleOperator', value: '==' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'len2' },
      { type: 'Symbol', value: '?' },
      { type: 'Identifier', value: 'Infinity' },
      { type: 'Symbol', value: ':' },
      { type: 'Identifier', value: 'nums2' },
      { type: 'Symbol', value: '[' },
      { type: 'Identifier', value: 'partLen2' },
      { type: 'Symbol', value: ']' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'if' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'L1' },
      { type: 'Operator', value: '>' },
      { type: 'Identifier', value: 'R2' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: '{' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'end' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Operator', value: '-' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: '}' },
      { type: 'Keyword', value: 'else' },
      { type: 'Keyword', value: 'if' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'L2' },
      { type: 'Operator', value: '>' },
      { type: 'Identifier', value: 'R1' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: '{' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Identifier', value: 'start' },
      { type: 'Operator', value: '=' },
      { type: 'Identifier', value: 'partLen1' },
      { type: 'Operator', value: '+' },
      { type: 'Number', value: '1' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: '}' },
      { type: 'Keyword', value: 'else' },
      { type: 'Symbol', value: '{' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Keyword', value: 'return' },
      { type: 'Identifier', value: 'len' },
      { type: 'Operator', value: '%' },
      { type: 'Number', value: '2' },
      { type: 'DoubleOperator', value: '==' },
      { type: 'Operator', value: '=' },
      { type: 'Number', value: '0' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: '?' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'Math' },
      { type: 'Symbol', value: '.' },
      { type: 'Identifier', value: 'max' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'L1' },
      { type: 'Symbol', value: ',' },
      { type: 'Identifier', value: 'L2' },
      { type: 'Symbol', value: ')' },
      { type: 'Operator', value: '+' },
      { type: 'Identifier', value: 'Math' },
      { type: 'Symbol', value: '.' },
      { type: 'Identifier', value: 'min' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'R1' },
      { type: 'Symbol', value: ',' },
      { type: 'Identifier', value: 'R2' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: ')' },
      { type: 'Operator', value: '/' },
      { type: 'Number', value: '2' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: ':' },
      { type: 'Identifier', value: 'Math' },
      { type: 'Symbol', value: '.' },
      { type: 'Identifier', value: 'max' },
      { type: 'Symbol', value: '(' },
      { type: 'Identifier', value: 'L1' },
      { type: 'Symbol', value: ',' },
      { type: 'Identifier', value: 'L2' },
      { type: 'Symbol', value: ')' },
      { type: 'Symbol', value: ';' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: '}' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: '}' },
      { type: 'LineFeed', value: '\n' },
      { type: 'Symbol', value: '}' },
      { type: 'Symbol', value: ';' }
    ]);
  });
});
