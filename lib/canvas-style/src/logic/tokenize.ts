import type { ParseDiagnostic, SourcePos } from '../types';

export type TokenKind =
  | 'ident'
  | 'number'
  | 'string'
  | 'hash'
  | 'delim'
  | 'colon'
  | 'semicolon'
  | 'comma'
  | 'lbrace'
  | 'rbrace'
  | 'lparen'
  | 'rparen'
  | 'eof';

export type Token = {
  kind: TokenKind;
  value: string;
  numberValue?: number;
  unit?: string;
  pos: SourcePos;
};

export type TokenizeResult = {
  tokens: Token[];
  diagnostics: ParseDiagnostic[];
};

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_\-]/.test(ch);
}

function isIdentContinue(ch: string): boolean {
  return /[A-Za-z0-9_\-]/.test(ch);
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

export function tokenize(source: string): TokenizeResult {
  const tokens: Token[] = [];
  const diagnostics: ParseDiagnostic[] = [];
  let i = 0;
  let line = 1;
  let column = 1;

  const peek = (offset = 0): string => source[i + offset] ?? '';
  const pos = (): SourcePos => ({ line, column });

  const advance = (): string => {
    const ch = source[i] ?? '';
    i += 1;
    if (ch === '\n') {
      line += 1;
      column = 1;
    } else if (ch !== '') {
      column += 1;
    }
    return ch;
  };

  const push = (
    kind: TokenKind,
    value: string,
    extras: Partial<Token> = {},
  ): void => {
    tokens.push({ kind, value, pos: extras.pos ?? pos(), ...extras });
  };

  while (i < source.length) {
    const ch = peek();

    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
      advance();
      continue;
    }

    if (ch === '/' && peek(1) === '*') {
      const start = pos();
      advance();
      advance();
      while (i < source.length && !(peek() === '*' && peek(1) === '/')) {
        advance();
      }
      if (i >= source.length) {
        diagnostics.push({
          message: 'コメントが閉じられていません',
          line: start.line,
          column: start.column,
        });
        break;
      }
      advance();
      advance();
      continue;
    }

    const start = pos();

    if (ch === '{') {
      advance();
      push('lbrace', '{', { pos: start });
      continue;
    }
    if (ch === '}') {
      advance();
      push('rbrace', '}', { pos: start });
      continue;
    }
    if (ch === '(') {
      advance();
      push('lparen', '(', { pos: start });
      continue;
    }
    if (ch === ')') {
      advance();
      push('rparen', ')', { pos: start });
      continue;
    }
    if (ch === ':') {
      advance();
      push('colon', ':', { pos: start });
      continue;
    }
    if (ch === ';') {
      advance();
      push('semicolon', ';', { pos: start });
      continue;
    }
    if (ch === ',') {
      advance();
      push('comma', ',', { pos: start });
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = advance();
      let value = '';
      while (i < source.length && peek() !== quote) {
        if (peek() === '\\') {
          advance();
          value += advance();
          continue;
        }
        value += advance();
      }
      if (peek() !== quote) {
        diagnostics.push({
          message: '文字列が閉じられていません',
          line: start.line,
          column: start.column,
        });
        break;
      }
      advance();
      push('string', value, { pos: start });
      continue;
    }

    if (ch === '#' && isIdentContinue(peek(1))) {
      // Read full #ident. Emit hash only for valid CSS color lengths so IDs
      // like #a / #go / #hud are not split or mistaken for colors mid-token.
      let value = advance();
      while (isIdentContinue(peek())) {
        value += advance();
      }
      const body = value.slice(1);
      const isColor =
        /^[A-Fa-f0-9]{3}$/.test(body) ||
        /^[A-Fa-f0-9]{4}$/.test(body) ||
        /^[A-Fa-f0-9]{6}$/.test(body) ||
        /^[A-Fa-f0-9]{8}$/.test(body);
      if (isColor) {
        push('hash', value, { pos: start });
      } else {
        push('ident', value, { pos: start });
      }
      continue;
    }

    if (
      isDigit(ch) ||
      (ch === '.' && isDigit(peek(1))) ||
      ((ch === '+' || ch === '-') && (isDigit(peek(1)) || (peek(1) === '.' && isDigit(peek(2)))))
    ) {
      let raw = '';
      if (ch === '+' || ch === '-') {
        raw += advance();
      }
      while (isDigit(peek())) {
        raw += advance();
      }
      if (peek() === '.' && isDigit(peek(1))) {
        raw += advance();
        while (isDigit(peek())) {
          raw += advance();
        }
      }
      let unit = '';
      if (isIdentStart(peek())) {
        while (isIdentContinue(peek())) {
          unit += advance();
        }
      }
      push('number', raw, {
        pos: start,
        numberValue: Number(raw),
        unit: unit || undefined,
      });
      continue;
    }

    if (isIdentStart(ch) || (ch === '.' && isIdentStart(peek(1)))) {
      let value = '';
      if (ch === '.') {
        value += advance();
      }
      while (isIdentContinue(peek())) {
        value += advance();
      }
      push('ident', value, { pos: start });
      continue;
    }

    if (ch === '!' || ch === '%' || ch === '*' || ch === '/' || ch === '=') {
      push('delim', advance(), { pos: start });
      continue;
    }

    diagnostics.push({
      message: `予期しない文字 '${ch}'`,
      line: start.line,
      column: start.column,
    });
    advance();
  }

  tokens.push({ kind: 'eof', value: '', pos: pos() });
  return { tokens, diagnostics };
}
