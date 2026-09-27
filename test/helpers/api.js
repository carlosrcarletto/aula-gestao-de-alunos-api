import request from 'supertest';
import 'dotenv/config';

// se tiver o base url ele pega , senao pega o localhost 3000 por padrao
// isso facilita quando for jogar para o heroku 
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export function api() {
    return request(BASE_URL);
}