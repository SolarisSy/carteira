# Aplicativo de Carteirinha Estudantil DNE

Uma aplicação web mobile para gerenciar e visualizar carteirinhas estudantis do DNE (Documento Nacional do Estudante).

## Funcionalidades

- Visualização de carteirinhas cadastradas
- Adição de novas carteirinhas estudantis
- Visualização detalhada de cada carteirinha
- Armazenamento local dos dados (localStorage)
- Geração de códigos QR para cada carteirinha
- Interface responsiva otimizada para dispositivos móveis

## Tecnologias Utilizadas

- HTML5
- CSS3 (com design responsivo)
- JavaScript (ES6+)
- LocalStorage para persistência de dados
- QRCode.js para geração de códigos QR

## Como Usar

1. Clone este repositório
2. Abra o arquivo `index.html` em um navegador web
3. Para melhor experiência em dispositivos móveis, use o modo de visualização móvel do navegador (DevTools)

## Estrutura de Dados

Os dados das carteirinhas são armazenados no arquivo `db.json` e no localStorage do navegador com a seguinte estrutura:

```json
{
  "students": [
    {
      "id": 1,
      "name": "Nome do Estudante",
      "institution": "Nome da Instituição",
      "course": "Nome do Curso",
      "level": "Nível de Ensino",
      "cpf": "000.000.000-00",
      "rg": "00.000.000-0",
      "birth": "YYYY-MM-DD",
      "validity": "YYYY-MM",
      "photoData": "URL_da_foto_ou_base64",
      "codeUse": "Código_de_uso"
    }
  ]
}
```

## Personalização

O aplicativo foi desenvolvido com as seguintes cores principais:
- Fundo: #AFDCCD
- Textos: Preto e Branco
- Botões: Laranja (#FF7F50) e outros

Para alterar o estilo visual, edite o arquivo `style.css`. 