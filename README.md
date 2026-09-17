# www.garagelab.com.br

Site estático das páginas de venda do catálogo Hotmart — Garage Labs, Garage Music e Trajetto.
Sem build, sem framework, sem dependência de pacote. HTML, um CSS e um JS. Publica direto no GitHub Pages.

**V1.0 · 16-09-2026**

---

## 1. O que tem aqui

| Endereço | Código | O que é |
|---|---|---|
| `/` | — | Vitrine Garage Labs: 10 avulsos e 3 coleções |
| `/music/` | — | Vitrine Garage Music: 6 avulsos e 1 coleção |
| `/trajetto/` | — | Vitrine Trajetto: 1 avulso |
| `/o-painel-esconde/` | LH-103 | Página dedicada · R$ 47 · entrada da escada comercial |
| `/colecao-portfolio-e-projetos/` | KIT-TRILHA | Página dedicada · R$ 97 |
| `/colecao-indicadores-e-metricas/` | KIT-COLECAO | Página dedicada · R$ 97 |
| `/biblioteca-garage-labs/` | KIT-BIBLIOTECA | Página dedicada · R$ 167 |
| `/biblioteca-garage-music/` | KIT-MUSIC | Página dedicada · R$ 127 |

Mais `assets/`, `img/` (uma pasta por código de produto), `404.html`, `robots.txt`, `sitemap.xml` e `CNAME`.

---

## 2. Antes de publicar — o que falta preencher

### Os links de checkout

Todos apontam hoje para `https://pay.hotmart.com/SUBSTITUIR-<CÓDIGO>`. Estão num arquivo só:

```
assets/checkouts.js
```

Troque a URL de cada código, faça commit, e as oito páginas passam a apontar para o lugar certo. Nada mais precisa mudar. Enquanto o link não existir, o botão continua visível e marcado como `aria-disabled`.

### As três frases de capa das vitrines

Precisam da sua aprovação, porque só a primeira está declarada em documento:

| Vitrine | Frase | Origem |
|---|---|---|
| Labs | "O que já foi testado, pronto para usar." | Frase-marca da Fundação de Marca V1.0 — a própria pendência 2 daquele documento diz que a escolha entre ela e as duas alternativas está aberta |
| Music | "Do desenho no braço ao domingo sem ensaio." | Derivada da headline declarada do KIT-MUSIC |
| Trajetto | "Decidir a qual vaga se candidatar, antes de escrever qualquer peça." | Derivada da headline declarada do LH-701 |

---

## 3. Publicar no GitHub Pages

1. Criar o repositório público e subir o conteúdo desta pasta na **raiz** do branch `main`.
2. Em **Settings › Pages**: *Deploy from a branch*, branch `main`, pasta `/ (root)`.
3. Em **Custom domain**, informar `www.garagelab.com.br`. O arquivo `CNAME` já vem com esse valor.
4. Marcar **Enforce HTTPS** depois que o certificado for emitido — leva alguns minutos.
5. No DNS do domínio:

| Tipo | Nome | Valor |
|---|---|---|
| CNAME | `www` | `<seu-usuário>.github.io` |
| A | `@` | os quatro IPs do GitHub Pages |

O registro A no apex faz `garagelab.com.br` redirecionar para `www`. Confira os IPs na documentação do GitHub Pages antes de salvar: eles mudam de tempos em tempos, e IP decorado é a causa mais comum de site fora do ar depois de uma migração.

O `.nojekyll` está na raiz para o Pages servir os arquivos como estão, sem processar com Jekyll.

---

## 4. Como mexer

### Trocar um preço

O preço aparece em três pontos por página dedicada — oferta, barra do topo e fecho — e uma vez por card de vitrine. Buscar por `R$` no arquivo da página resolve.

### Trocar uma cor de linha

Cada página declara quatro variáveis no `<head>`:

```html
<style>:root{--linha:#0B6FB0;--linha-texto:#0B6FB0;--linha-neg:#4FA5DC;--linha-caixa:rgba(11,111,176,.13)}</style>
```

| Variável | Onde entra |
|---|---|
| `--linha` | Réguas, bordas, preenchimentos. É a cor declarada na ficha técnica do PDF |
| `--linha-texto` | A mesma cor, escurecida até passar 4,5:1 sobre branco |
| `--linha-neg` | A mesma cor, clareada até passar 4,5:1 sobre preto. Usada no bloco escuro |
| `--linha-caixa` | A cor a 13%, para fundo de caixa |

Nas cores claras da paleta — Amarelo-sinal `#F4B301` e Laranja `#DF892B` — a `--linha-texto` fica visivelmente mais escura que a original. É de propósito: `#F4B301` dá 1,9:1 sobre branco e `#DF892B` dá 2,6:1. Como cor de texto, as duas reprovam. Como régua e borda, continuam sendo a cor da linha.

### Acrescentar um produto

1. Copiar as duas imagens para `img/<CÓDIGO>/`, com os nomes `vitrine-720x1040-<slug>.png` e `banner-1920x1080-<slug>.png`.
2. Acrescentar o código em `assets/checkouts.js`.
3. Copiar um card existente na vitrine da marca e trocar o conteúdo.
4. Se o produto for ganhar página dedicada, copiar a pasta de uma página dedicada e trocar o miolo.

### Blocos próprios de um produto

O chassi monta sete blocos a partir da ficha de cadastro. Quando um produto tiver conteúdo próprio que valha uma seção — como as **seis portas** na página do LH-103 — ele entra como bloco extra, com a classe `.portas`. Regra: só entra o que está declarado no PDF ou na ficha. O chassi não inventa conteúdo de produto.

---

## 5. Regras que o chassi carrega

Estão no HTML, não em documento à parte. Quem editar precisa manter:

- Todo produto declara **o que não entrega**, em bloco próprio, na própria página.
- Sem contagem regressiva, sem vagas limitadas, sem selo de escassez.
- Sem depoimento, número de vendas ou prova social de qualquer tipo.
- A promessa é de método e artefato — nunca de resultado, economia ou prazo.
- Todo número que aparece foi contado no arquivo. Número estimado não entra.
- Sem emoji.

---

## 6. Acessibilidade e desempenho

- Os pares de cor usados passam em AA. O menor é 4,53:1, no texto do botão sobre o laranja de ação.
- Botão principal com 56 px de altura; no celular, barra fixa de 48 px.
- Corpo de texto em 19 px, com controle A−/A+ em todas as páginas.
- A imagem de capa de cada página dedicada carrega com `fetchpriority="high"`; todas as demais com `loading="lazy"`.
- Peso total do site: cerca de 1,5 MB, quase tudo em imagem.
- Nenhuma página tem rolagem horizontal em tela de 390 px.
- Única dependência externa: as fontes do Google — Archivo, IBM Plex Sans e IBM Plex Mono. Se o Google Fonts cair, o texto vai para a pilha de fontes do sistema e o layout não quebra.

---

## 7. Divergência conhecida no kit de origem

A tabela **Frases de banner** do LH-103 diz "Treze prompts". O inventário contado, a descrição longa e a própria arte do banner dizem dezoito. As páginas estão com **dezoito**. A linha da frase de banner precisa ser corrigida no kit antes de virar criativo de anúncio.
