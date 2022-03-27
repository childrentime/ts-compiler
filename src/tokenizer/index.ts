import lexer from './lexer';

const tokenizer = (input: string): { type: string; value: string }[] => {
  lexer.start(input);
  return lexer.DFA.result.tokens;
};

export default tokenizer;
