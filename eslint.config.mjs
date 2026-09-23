import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['node_modules/**','.next/**','gee/**','files/**','scripts/gee/**','public/**','next-env.d.ts'] },
  ...tseslint.configs.recommended,
  { files:['**/*.ts','**/*.tsx'],rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}]} }
);
