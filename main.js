import fs from 'fs';
import { createInterface } from 'readline';
import Scanner from './lox/Scanner.js';
import Parser from './lox/Parser.js';
import Interpreter from './lox/Interpreter.js';

class Lox {
  constructor() {
    this.hadError = false;
    this.hadRuntimeError = false;
    this.interpreter = new Interpreter();
  }

  // Executa um arquivo .lox
  runFile(path) {
    try {
      const bytes = fs.readFileSync(path, 'utf8');
      this.run(bytes);
      
      // Se houve erro de sintaxe, sai com código 65
      if (this.hadError) process.exit(65);
      // Se houve erro de runtime, sai com código 70
      if (this.hadRuntimeError) process.exit(70);
    } catch (error) {
      console.error(`Erro ao ler arquivo: ${error.message}`);
      process.exit(1);
    }
  }

  // Executa o REPL (modo interativo)
  runPrompt() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });

    console.log('Interpretador Lox - Digite "sair" para encerrar');
    rl.prompt();

    rl.on('line', (line) => {
      if (line.trim() === 'sair') {
        rl.close();
        return;
      }
      
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        rl.prompt();
        return;
      }
      
      // Se não termina com ';', provavelmente é uma expressão
      if (!line.includes(';')) {
        // Tenta como expressão primeiro
        this.runExpression(line);
        if (!this.hadError) {
          this.hadError = false;
          rl.prompt();
          return;
        }
      }
      
      // Tenta interpretar como statement
      this.hadError = false;
      this.run(line);
      
      this.hadError = false; // Reset no modo interativo
      rl.prompt();
    });

    rl.on('close', () => {
      console.log('\nTchau!');
      process.exit(0);
    });
  }

  // Executa uma expressão no REPL
  runExpression(source) {
    try {
      // Análise léxica
      const scanner = new Scanner(source);
      const tokens = scanner.scanTokens();

      // Análise sintática como expressão
      const parser = new Parser(tokens);
      const expr = parser.parseExpression();

      // Para em caso de erro de sintaxe
      if (this.hadError || expr === null) return;

      // Avalia e mostra o resultado
      const result = this.interpreter.evaluate(expr);
      if (result !== null && result !== undefined) {
        console.log(this.interpreter.stringify(result));
      }
    } catch (error) {
      // Silencioso - se falhar, não mostra nada
    }
  }

  // Executa código Lox
  run(source, suppressErrors = false) {
    try {
      // Análise léxica
      const scanner = new Scanner(source);
      const tokens = scanner.scanTokens();

      // Análise sintática
      const parser = new Parser(tokens);
      const statements = parser.parse();

      // Para em caso de erro de sintaxe
      if (this.hadError) return;

      // Remove statements null (causados por erros de parsing)
      const validStatements = statements.filter(stmt => stmt !== null);

      // Interpretação
      this.interpreter.interpret(validStatements);
    } catch (error) {
      if (!suppressErrors) {
        console.error(`Erro inesperado: ${error.message}`);
      }
    }
  }

  // Reporta erro de sintaxe
  error(line, message) {
    this.report(line, "", message);
  }

  // Reporta erro (pode ser suprimido)
  report(line, where, message, suppress = false) {
    if (!suppress) {
      console.error(`[linha ${line}] Erro${where}: ${message}`);
    }
    this.hadError = true;
  }

  // Reporta erro de runtime
  runtimeError(error) {
    console.error(`${error.message}\n[linha ${error.token.line}]`);
    this.hadRuntimeError = true;
  }
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  const lox = new Lox();

  if (args.length > 1) {
    console.log("Uso: node main.js [script]");
    process.exit(64);
  } else if (args.length === 1) {
    // Executa arquivo
    lox.runFile(args[0]);
  } else {
    // Modo interativo
    lox.runPrompt();
  }
}

// Executa se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default Lox;
