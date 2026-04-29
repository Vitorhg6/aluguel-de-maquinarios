/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './painel.html'), 'utf8');

describe('Painel de Perfil', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  test('deve renderizar o título da seção corretamente', () => {
    const title = document.querySelector('.section-title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('MEU PERFIL');
  });

  test('deve conter todos os campos de entrada necessários', () => {
    expect(document.getElementById('nome')).not.toBeNull();
    expect(document.getElementById('email')).not.toBeNull();
    expect(document.getElementById('telefone')).not.toBeNull();
    expect(document.getElementById('senha')).not.toBeNull();
  });

  test('o campo de e-mail deve ser do tipo email para validação nativa', () => {
    const emailInput = document.getElementById('email');
    expect(emailInput.getAttribute('type')).toBe('email');
  });

  test('deve ter um botão de submissão dentro do formulário', () => {
    const btn = document.getElementById('btn-salvar');
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('type')).toBe('submit');
  });

  test('as labels devem estar associadas corretamente aos inputs', () => {
    const labelNome = document.querySelector('label[for="nome"]');
    expect(labelNome).not.toBeNull();
  });
});