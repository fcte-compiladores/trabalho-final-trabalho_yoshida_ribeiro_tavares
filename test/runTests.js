import { testRunner as basicTests } from './BasicTests.js';
import { testRunner as controlFlowTests } from './ControlFlowTests.js';
import { testRunner as functionTests } from './FunctionTests.js';
import { testRunner as classTests } from './ClassTests.js';
import { testRunner as errorTests } from './ErrorTests.js';

async function runAllTests() {
  console.log('Iniciando suíte completa de testes do interpretador Lox\n');
  
  console.log('Testes Básicos (Literals, Operadores)');
  console.log('=' .repeat(50));
  await basicTests.runAllTests();
  
  console.log('\nTestes de Controle de Fluxo');
  console.log('=' .repeat(50));
  await controlFlowTests.runAllTests();
  
  console.log('\nTestes de Funções');
  console.log('=' .repeat(50));
  await functionTests.runAllTests();
  
  console.log('\nTestes de Classes');
  console.log('=' .repeat(50));
  await classTests.runAllTests();
  
  console.log('\nTestes de Tratamento de Erros');
  console.log('=' .repeat(50));
  await errorTests.runAllTests();
  
  const totalPassed = basicTests.passedTests + controlFlowTests.passedTests + 
                     functionTests.passedTests + classTests.passedTests + errorTests.passedTests;
  const totalFailed = basicTests.failedTests + controlFlowTests.failedTests + 
                     functionTests.failedTests + classTests.failedTests + errorTests.failedTests;
  const totalTests = totalPassed + totalFailed;
  
  console.log('\n' + '=' .repeat(60));
  console.log('RESUMO GERAL DOS TESTES');
  console.log('=' .repeat(60));
  console.log(`Total de testes: ${totalTests}`);
  console.log(`Passou: ${totalPassed}`);
  console.log(`Falhou: ${totalFailed}`);
  console.log(`Taxa de sucesso: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
}

runAllTests().catch(console.error);
