import { flowModel, DFA_STATE_CONST, ENUM_CONST, tool } from './js-define';

// 词法分析器
const lexer = {
  // 输入流读取
  ISR: {
    props: {
      stream: '', // 字符流
      length: 0, // 字符流长度
      seq: 0 // 字符流句子个数
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
      // 设置字符流
      lexer.ISR.propsChange.set('stream', stream);

      // 用一个换行符替换多个换行符
      lexer.ISR.propsChange.set(
        'stream',
        lexer.ISR.props.stream.replace(/\n+/g, '\n').trim()
      );

      // 计算字符流长度和序列数
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

  // 确定性有限自动机
  DFA: {
    result: {
      matchs: [] as string[], // 匹配字符队列
      tokens: [] as { type: string; value: string }[] // 生成的token
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

    state: DFA_STATE_CONST.S_RESET, // 当前的状态
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

  // 重置数据
  resetDefault() {
    flowModel.resultChange.toDefault();
    lexer.ISR.propsChange.toDefault();
    lexer.DFA.resultChange.toDefault();
  },

  // 开始
  start(stream: any) {
    lexer.resetDefault();
    lexer.ISR.before(stream);
    lexer.ISR.read();
    lexer.ISR.after();
  }
};

export default lexer;
