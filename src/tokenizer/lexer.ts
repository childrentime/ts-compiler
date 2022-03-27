import { flowModel, DFA_STATE_CONST, ENUM_CONST, tool } from './js-define';

// Lexical analyzer
const lexer = {
  // Input Stream Reader
  ISR: {
    props: {
      stream: '', // Character stream
      length: 0, // Length of character stream
      seq: 0 // The sequence number of the character stream
    },
    propsChange: {
      set(prop: 'stream' | 'length' | 'seq', value: string | number) {
        // @ts-ignore
        if (typeof lexer.ISR.props[prop] !== 'undefined') {
          // @ts-ignore
          lexer.ISR.props[prop] = value;
        }
      },
      incrSeq() {
        lexer.ISR.props.seq++;
      },
      toDefault() {
        lexer.ISR.props.stream = '';
        lexer.ISR.props.length = 0;
        lexer.ISR.props.seq = 0;
      }
    },

    before(stream: any) {
      // Determine character stream
      lexer.ISR.propsChange.set('stream', stream);

      // Replace multiple line feeds with one line feed
      lexer.ISR.propsChange.set(
        'stream',
        lexer.ISR.props.stream.replace(/\n+/g, '\n').trim()
      );

      // Calculate character stream length and sequence number
      lexer.ISR.propsChange.set('length', lexer.ISR.props.stream.length);
      lexer.ISR.propsChange.set('seq', 0);
    },
    after() {
      lexer.DFA.resultChange.filterTokens();
    },
    nextChar() {
      let seq = lexer.ISR.props.seq;
      if (seq <= lexer.ISR.props.length - 1) {
        return lexer.ISR.props.stream[seq];
      }
      return false;
    },
    isLastChar() {
      return lexer.ISR.props.seq === lexer.ISR.props.length - 1;
    },
    read() {
      let ch: string | false = '';
      while ((ch = lexer.ISR.nextChar()) !== false) {
        let match = false;
        let end = false;

        let state = lexer.DFA.state;
        let nextState = flowModel.getNextState(
          ch,
          state,
          lexer.DFA.result.matchs
        );
        if (nextState !== DFA_STATE_CONST.S_RESET) {
          match = true;
          if (lexer.ISR.isLastChar()) {
            end = true;
          }
        }
        let path = {
          state: state,
          ch: ch,
          nextState: nextState,
          match: match,
          end: end
        };
        flowModel.resultChange.pathGrow(path);

        if (match) {
          lexer.ISR.propsChange.incrSeq();
          lexer.DFA.events.flowtoNextState(ch, nextState);
          if (end) {
            lexer.DFA.resultChange.produceToken();
          }
        } else {
          lexer.DFA.resultChange.produceToken();
          lexer.DFA.events.flowtoResetState();
        }
      }
    }
  },

  // Deterministic finite automaton
  DFA: {
    result: {
      matchs: [] as string[], // Matched character queue
      tokens: [] as { type: string; value: string }[] // List of generated tokens
    },
    resultChange: {
      toDefault() {
        lexer.DFA.state = DFA_STATE_CONST.S_RESET;
        lexer.DFA.result.matchs = [];
        lexer.DFA.result.tokens = [];
      },
      pushToTokens(token: { type: string; value: string }) {
        lexer.DFA.result.tokens.push(token);
        lexer.DFA.result.matchs = [];
      },
      pushToMatchs(ch: any) {
        lexer.DFA.result.matchs.push(ch);
      },
      filterTokens() {
        let tokens: { type: string; value: string }[] = [];
        lexer.DFA.result.tokens.forEach(token => {
          if (token.value !== ENUM_CONST.WHITESPACE) {
            tokens.push(token);
          }
        });
        lexer.DFA.result.tokens = tokens;
      },
      produceToken() {
        if (lexer.DFA.result.matchs.length) {
          let value = lexer.DFA.result.matchs.join('');
          let type = tool.judgeTokenType(lexer.DFA.state, value);
          let token = {
            type: type,
            value: value
          };
          lexer.DFA.resultChange.pushToTokens(token);
        }
      }
    },

    state: DFA_STATE_CONST.S_RESET, // Current machine status
    events: {
      flowtoNextState(ch: string, state: number) {
        lexer.DFA.resultChange.pushToMatchs(ch);
        lexer.DFA.state = state;
      },

      flowtoResetState() {
        lexer.DFA.state = DFA_STATE_CONST.S_RESET;
      }
    }
  },

  // Reset lexer data
  resetDefault() {
    flowModel.resultChange.toDefault();
    lexer.ISR.propsChange.toDefault();
    lexer.DFA.resultChange.toDefault();
  },

  // Start working
  start(stream: any) {
    lexer.resetDefault();
    lexer.ISR.before(stream);
    lexer.ISR.read();
    lexer.ISR.after();
  }
};

export default lexer;
