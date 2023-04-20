module.exports = {
  testEnvironment: 'node', // Define o ambiente de teste como Node.js
  testMatch: ['**/*.spec.ts'], // Padrão de arquivos de teste
  moduleFileExtensions: ['ts', 'js'], // Extensões de arquivos suportadas
  transform: {
    '^.+\\.ts$': 'ts-jest' // Usa o ts-jest para transformar arquivos TypeScript em JavaScript durante a execução dos testes
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json' // Caminho para o arquivo de configuração do TypeScript
    }
  }
};
