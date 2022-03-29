import { Config, Tokenizer } from './tokenizer';

const tokenizer = (code: string, options?: Config) => {
  const tokenizer = new Tokenizer(code, options);

  const tokens: any = [];

  try {
    while (true) {
      let token = tokenizer.getNextToken();
      if (!token) {
        break;
      }
      tokens.push(token);
    }
  } catch (e: any) {
    tokenizer.errorHandler.tolerate(e);
  }

  if (tokenizer.errorHandler.tolerant) {
    tokens.errors = tokenizer.errors();
  }

  return tokens;
};

export { tokenizer };
