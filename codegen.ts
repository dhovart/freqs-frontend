import type { CodegenConfig } from '@graphql-codegen/cli'
import cookieParser from 'tough-cookie';
import path from 'path';
import fs from 'fs';

const cookiePath = path.resolve(__dirname, 'support', 'cookie.json');

if(!fs.existsSync(cookiePath)) {
  console.error('Please run `npm run grab-auth-cookie` first')
  process.exit(0)
}

const cookieJSON =  fs.readFileSync(cookiePath, 'utf-8');
const cookie = cookieParser.fromJSON(cookieJSON).cookieString();

console.log(cookie);

const config: CodegenConfig = {
  schema: {
    'http://localhost:8080/graphql': {
      headers: {
        'Cookie': cookie
      }
    }
  },
  documents: './src/**/*.ts',
  generates: {
    './src/types/api.ts': {
      plugins: ['typescript']
    }
  }
}
export default config
