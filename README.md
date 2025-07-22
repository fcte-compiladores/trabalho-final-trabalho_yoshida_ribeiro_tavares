[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Hppw7Zh2)

# Interpretador Lox

## Integrantes
- [Luana Ribeiro](https://github.com/luanasoares0901) - [202016720]
- [Gabriel Esteves](https://github.com/GabrielMEsteves) - [190106956]
- [Júlia Yoshida](https://github.com/juliaryoshida) - [200021222] 

## Introdução

Este projeto implementa um interpretador completo para a linguagem de programação Lox, uma linguagem dinamicamente tipada inspirada em JavaScript e Python. O interpretador foi desenvolvido em JavaScript/Node.js seguindo a arquitetura tree-walking interpreter.

### Características da Linguagem Lox

A linguagem Lox suporta:
- **Tipos de dados**: números (ponto flutuante), strings, booleanos e nil
- **Variáveis**: declaração com `var` e atribuição
- **Estruturas de controle**: `if/else`, `while`, `for`
- **Funções**: declaração com `fun`, parâmetros e valores de retorno
- **Classes**: orientação a objetos com herança
- **Operadores**: aritméticos, de comparação e lógicos

### Exemplos de Sintaxe

**Variáveis e Tipos:**
```lox
var nome = "Mundo";
var numero = 42;
var verdadeiro = true;
var nada = nil;
```

**Estruturas de Controle:**
```lox
if (numero > 0) {
    print "Número positivo";
} else {
    print "Número não positivo";
}

for (var i = 0; i < 10; i = i + 1) {
    print i;
}
```

**Funções:**
```lox
fun fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 2) + fibonacci(n - 1);
}

print fibonacci(10);
```

**Classes e Herança:**
```lox
class Animal {
    init(nome) {
        this.nome = nome;
    }
    
    falar() {
        print this.nome + " faz um som";
    }
}

class Cachorro < Animal {
    falar() {
        print this.nome + " late";
    }
}
```

### Estratégias e Algoritmos

O interpretador segue a arquitetura clássica de compiladores com as seguintes etapas:

1. **Análise Léxica** ([`Scanner`](lox/Scanner.js)): Tokenização do código fonte usando autômato finito
2. **Análise Sintática** ([`Parser`](lox/Parser.js)): Parser recursivo descendente que gera uma AST
3. **Interpretação** ([`Interpreter`](lox/Interpreter.js)): Tree-walking interpreter que executa a AST diretamente

**Algoritmos Principais:**
- **Tokenização**: Reconhecimento de padrões usando máquina de estados
- **Parsing**: Precedência de operadores implementada com recursive descent
- **Resolução de Escopo**: Ambientes encadeados para gerenciamento de variáveis
- **Orientação a Objetos**: Implementação de classes com herança single e dynamic dispatch

## Instalação

### Pré-requisitos
- Node.js versão 14.0.0 ou superior

### Passos para Instalação

1. Clone o repositório:
```bash
git clone [https://github.com/fcte-compiladores/trabalho-final-trabalho_yoshida_ribeiro_tavares.git]
cd lox-interpreter
```

2. Instale as dependências:
```bash
npm install
```

### Como Executar

**Modo Interativo (REPL):**
```bash
npm start
# ou
node main.js
```

**Executar um arquivo .lox:**
```bash
npm run test
# ou
node main.js arquivo.lox
```

**Exemplo de uso:**
```bash
# Modo interativo
$ npm start
> var x = 10;
> print x * 2;
20
> sair

# Executar arquivo
$ node main.js examples/fibonacci.lox
```

## Exemplos

O projeto deve incluir uma pasta `examples/` com arquivos demonstrando diferentes recursos:

- `hello.lox` - Hello World básico
- `fibonacci.lox` - Sequência de Fibonacci
- `classes.lox` - Exemplo com classes e herança
- `loops.lox` - Estruturas de repetição
- `functions.lox` - Declaração e uso de funções

## Referências

- **"Crafting Interpreters" por Robert Nystrom**: Referência principal para a arquitetura do interpretador e implementação da linguagem Lox. O livro forneceu a base teórica e prática para todas as etapas do desenvolvimento.

- **"Compilers: Principles, Techniques, and Tools" (Dragon Book)**: Utilizado para conceitos fundamentais de análise léxica e sintática, especialmente para a implementação do parser recursivo descendente.

### Contribuições Originais

- Implementação em JavaScript/Node.js (o livro original usa Java)
- Adição de modo REPL interativo com suporte a expressões
- Melhorias na detecção e tratamento de erros
- Adaptação das mensagens de erro para português

## Estrutura do Código

```
main.js                 # Ponto de entrada e CLI
package.json           # Configuração do projeto
lox/
├── Scanner.js         # Análise léxica (tokenização)
├── Parser.js          # Análise sintática (AST)
├── Interpreter.js     # Interpretação e execução
├── Environment.js     # Gerenciamento de escopo
├── Token.js           # Representação de tokens
├── TokenType.js       # Definição dos tipos de tokens
├── Keywords.js        # Palavras-chave da linguagem
├── Expr.js            # Classes para expressões da AST
├── Stmt.js            # Classes para statements da AST
├── LoxFunction.js     # Implementação de funções
├── LoxClass.js        # Implementação de classes
├── RuntimeError.js    # Tratamento de erros de execução
└── ParserError.js     # Tratamento de erros de parsing
```

### Etapas de Compilação

1. **Análise Léxica**: Realizada em [`Scanner.js`](lox/Scanner.js) - converte código fonte em tokens
2. **Análise Sintática**: Implementada em [`Parser.js`](lox/Parser.js) - gera árvore sintética abstrata
3. **Interpretação**: Executada em [`Interpreter.js`](lox/Interpreter.js) - percorre e executa a AST

### Estruturas de Dados Principais

- **AST**: Hierarquia de classes em [`Expr.js`](lox/Expr.js) e [`Stmt.js`](lox/Stmt.js)
- **Environment**: Gerenciamento de escopo com ambientes encadeados
- **Token**: Representação de elementos léxicos com tipo, lexema e linha

## Bugs/Limitações/Problemas Conhecidos

### Limitações Atuais

1. **Tratamento de Erros**: Erros de runtime param a execução abruptamente em alguns casos
2. **Garbage Collection**: Não há coleta de lixo implementada, dependendo do GC do JavaScript
3. **Números**: Apenas suporte a ponto flutuante, sem inteiros dedicados
4. **Imports/Modules**: Não há sistema de módulos implementado

### Melhorias Incrementais Possíveis

1. **Melhor Tratamento de Erros**: Implementar recuperação de erros mais robusta no parser
2. **Otimizações**: Adicionar otimizações básicas como constant folding
3. **Debugging**: Adicionar suporte a breakpoints e step-by-step debugging
4. **Mais Tipos**: Implementar arrays e dicionários nativos
5. **Standard Library**: Expandir funções nativas (string manipulation, math functions)
6. **Análise Estática**: Implementar verificação de tipos opcional ou warnings para variáveis não utilizadas
