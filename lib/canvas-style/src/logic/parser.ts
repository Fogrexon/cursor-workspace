import type {
  CssValue,
  Declaration,
  ParseDiagnostic,
  PseudoState,
  Rule,
  SimpleSelector,
  SourcePos,
  Stylesheet,
} from '../types';
import { tokenize, type Token } from './tokenize';

const PSEUDOS = new Set<PseudoState>(['hover', 'active']);

class Parser {
  private index = 0;
  private readonly diagnostics: ParseDiagnostic[];

  constructor(
    private readonly tokens: Token[],
    seedDiagnostics: ParseDiagnostic[] = [],
  ) {
    this.diagnostics = [...seedDiagnostics];
  }

  parse(): Stylesheet {
    const rules: Rule[] = [];
    while (!this.check('eof')) {
      if (this.check('rbrace')) {
        this.error(this.peek(), '対応する { がありません');
        this.advance();
        continue;
      }
      const rule = this.parseRule();
      if (rule) {
        rules.push(rule);
      }
    }
    return { rules, diagnostics: this.diagnostics };
  }

  private parseRule(): Rule | null {
    const start = this.peek().pos;
    const selectors = this.parseSelectorList();
    if (selectors.length === 0) {
      this.synchronize();
      return null;
    }

    if (!this.match('lbrace')) {
      this.error(this.peek(), 'セレクターの後に { が必要です');
      this.synchronize();
      return null;
    }

    const declarations: Declaration[] = [];
    while (!this.check('rbrace') && !this.check('eof')) {
      const decl = this.parseDeclaration();
      if (decl) {
        declarations.push(decl);
      } else if (!this.check('rbrace') && !this.check('eof')) {
        this.advance();
      }
    }

    if (!this.match('rbrace')) {
      this.error(this.peek(), '} が必要です');
    }

    return { selectors, declarations, pos: start };
  }

  private parseSelectorList(): SimpleSelector[] {
    const selectors: SimpleSelector[] = [];
    do {
      const selector = this.parseSimpleSelector();
      if (!selector) {
        break;
      }
      selectors.push(selector);
    } while (this.match('comma'));
    return selectors;
  }

  private parseSimpleSelector(): SimpleSelector | null {
    const selector: SimpleSelector = { classes: [] };
    let sawPart = false;

    while (true) {
      const token = this.peek();
      if (token.kind === 'ident' && token.value.startsWith('.')) {
        selector.classes.push(token.value.slice(1));
        this.advance();
        sawPart = true;
        continue;
      }
      if (
        token.kind === 'hash' ||
        (token.kind === 'ident' && token.value.startsWith('#'))
      ) {
        if (selector.id) {
          this.error(token, 'セレクターに複数の ID は使えません');
        }
        // Tokenizer emits hex-looking IDs (#a, #go, #bar) as hash tokens.
        selector.id = token.value.startsWith('#')
          ? token.value.slice(1)
          : token.value;
        this.advance();
        sawPart = true;
        continue;
      }
      if (token.kind === 'ident' && !token.value.startsWith('.') && !token.value.startsWith('#')) {
        if (selector.type) {
          break;
        }
        selector.type = token.value;
        this.advance();
        sawPart = true;
        continue;
      }
      if (token.kind === 'colon') {
        this.advance();
        const nameToken = this.peek();
        if (nameToken.kind !== 'ident') {
          this.error(nameToken, '疑似クラス名が必要です');
          break;
        }
        if (nameToken.value === 'root' && !sawPart) {
          selector.type = 'root';
          this.advance();
          sawPart = true;
          continue;
        }
        const name = nameToken.value as PseudoState;
        if (!PSEUDOS.has(name)) {
          this.error(nameToken, `未対応の疑似クラス :${nameToken.value}`);
        } else {
          selector.pseudo = name;
        }
        this.advance();
        sawPart = true;
        continue;
      }
      break;
    }

    return sawPart ? selector : null;
  }

  private parseDeclaration(): Declaration | null {
    while (this.match('semicolon')) {
      /* skip empty */
    }
    if (this.check('rbrace') || this.check('eof')) {
      return null;
    }

    const nameToken = this.peek();
    if (nameToken.kind !== 'ident') {
      this.error(nameToken, 'プロパティ名が必要です');
      this.skipToDeclarationBoundary();
      return null;
    }
    this.advance();

    if (!this.match('colon')) {
      this.error(this.peek(), ': が必要です');
      this.skipToDeclarationBoundary();
      return null;
    }

    const value = this.parseValue();
    if (!value) {
      this.skipToDeclarationBoundary();
      return null;
    }

    let important = false;
    if (this.check('delim') && this.peek().value === '!') {
      this.advance();
      const importantToken = this.peek();
      if (importantToken.kind === 'ident' && importantToken.value.toLowerCase() === 'important') {
        important = true;
        this.advance();
      } else {
        this.error(importantToken, '!important が必要です');
      }
    }

    if (!this.check('rbrace')) {
      if (!this.match('semicolon')) {
        this.error(this.peek(), '; が必要です');
        this.skipToDeclarationBoundary();
      }
    }

    return {
      property: nameToken.value,
      value,
      important,
      pos: nameToken.pos,
    };
  }

  private parseValue(): CssValue | null {
    const items: CssValue[] = [];
    while (!this.isValueTerminator()) {
      const item = this.parseSingleValue();
      if (!item) {
        break;
      }
      items.push(item);
    }
    if (items.length === 0) {
      this.error(this.peek(), '値が必要です');
      return null;
    }
    if (items.length === 1) {
      return items[0]!;
    }
    return { kind: 'list', items };
  }

  private parseSingleValue(): CssValue | null {
    const token = this.peek();
    if (token.kind === 'number') {
      this.advance();
      return {
        kind: 'number',
        value: token.numberValue ?? Number(token.value),
        unit: token.unit,
      };
    }
    if (token.kind === 'hash') {
      this.advance();
      return { kind: 'color', value: token.value };
    }
    if (token.kind === 'string') {
      this.advance();
      return { kind: 'string', value: token.value };
    }
    if (token.kind === 'ident') {
      const name = token.value;
      this.advance();
      if (name === 'var' && this.match('lparen')) {
        return this.parseVarFunction();
      }
      if (name.startsWith('--')) {
        return { kind: 'keyword', value: name };
      }
      if (/^transparent$|^none$|^inherit$/i.test(name) || /^[a-z]+$/i.test(name)) {
        return { kind: 'keyword', value: name };
      }
      return { kind: 'keyword', value: name };
    }
    return null;
  }

  private parseVarFunction(): CssValue {
    const nameToken = this.peek();
    if (nameToken.kind !== 'ident' || !nameToken.value.startsWith('--')) {
      this.error(nameToken, 'var() には --name が必要です');
      this.skipUntil('rparen');
      this.match('rparen');
      return { kind: 'keyword', value: 'transparent' };
    }
    this.advance();

    let fallback: CssValue | undefined;
    if (this.match('comma')) {
      fallback = this.parseValue() ?? undefined;
    }
    if (!this.match('rparen')) {
      this.error(this.peek(), ') が必要です');
    }
    return { kind: 'var', name: nameToken.value, fallback };
  }

  private isValueTerminator(): boolean {
    const token = this.peek();
    if (token.kind === 'semicolon' || token.kind === 'rbrace' || token.kind === 'eof') {
      return true;
    }
    if (token.kind === 'delim' && token.value === '!') {
      return true;
    }
    return false;
  }

  private skipToDeclarationBoundary(): void {
    while (!this.check('semicolon') && !this.check('rbrace') && !this.check('eof')) {
      this.advance();
    }
    this.match('semicolon');
  }

  private skipUntil(kind: Token['kind']): void {
    while (!this.check(kind) && !this.check('eof')) {
      this.advance();
    }
  }

  private synchronize(): void {
    while (!this.check('eof')) {
      if (this.match('rbrace')) {
        return;
      }
      this.advance();
    }
  }

  private peek(): Token {
    return this.tokens[this.index] ?? this.tokens[this.tokens.length - 1]!;
  }

  private check(kind: Token['kind']): boolean {
    return this.peek().kind === kind;
  }

  private advance(): Token {
    const token = this.peek();
    if (token.kind !== 'eof') {
      this.index += 1;
    }
    return token;
  }

  private match(kind: Token['kind']): boolean {
    if (!this.check(kind)) {
      return false;
    }
    this.advance();
    return true;
  }

  private error(token: Token, message: string): void {
    const pos: SourcePos = token.pos;
    this.diagnostics.push({
      message,
      line: pos.line,
      column: pos.column,
    });
  }
}

export function parseStylesheet(source: string): Stylesheet {
  const { tokens, diagnostics } = tokenize(source);
  return new Parser(tokens, diagnostics).parse();
}
