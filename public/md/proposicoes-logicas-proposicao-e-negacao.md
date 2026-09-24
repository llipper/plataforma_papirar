# Proposições Lógicas --- Proposição e Negação

Este material foi organizado em quatro partes:

1.  **Proposições**
2.  **Conectivos lógicos**
3.  **Negação simples**
4.  **Negação de proposições compostas**

As lousas funcionam como resumos visuais. Depois de cada uma, o conteúdo
é desenvolvido com explicações e exemplos.

------------------------------------------------------------------------

# 1. Proposições

Uma **proposição lógica** é uma sentença declarativa à qual podemos
atribuir um valor lógico:

-   **V** --- verdadeiro;
-   **F** --- falso.

Uma proposição não precisa ser verdadeira para ser uma proposição. Ela
precisa apenas permitir uma classificação entre **V** e **F**.

## Exemplos

> **p:** Brasília é a capital do Brasil.

Temos:

**p = V**

Agora:

> **q:** O Brasil fica na Europa.

Temos:

**q = F**

As duas frases são proposições. Uma é verdadeira e a outra é falsa.

## Lousa --- Proposições

![Lousa sobre proposições lógicas](/images/logica/proposicoes.png)

### BIZU

> 💡 **Pergunte:** "Essa frase pode ser julgada como verdadeira ou
> falsa?"
>
> Se a resposta for **sim**, há uma forte indicação de que estamos
> diante de uma proposição.

## O que normalmente NÃO é proposição?

### Perguntas

> Você estudou hoje?

Não estamos afirmando algo que possa ser classificado diretamente como V
ou F.

### Ordens

> Estude para a prova!

É uma ordem, e não uma afirmação.

### Exclamações

> Que prova maravilhosa!

Também não possui um valor lógico objetivo de V ou F.

### Sentenças abertas

> x + 2 = 10

Sem saber o valor de `x`, não conseguimos determinar V ou F.

------------------------------------------------------------------------

# 2. Conectivos Lógicos

Até aqui vimos proposições simples.

Considere:

> **p:** João estuda.

e:

> **q:** João trabalha.

Podemos ligar essas proposições:

> João estuda **e** João trabalha.

Agora temos uma **proposição composta**.

O elemento que conecta `p` e `q` é chamado de **conectivo lógico**.

## Lousa --- Conectivos Lógicos

![Lousa sobre conectivos lógicos](/images/logica/conectivos-logicos.png)

## Principais conectivos

  Operação               Símbolo  Leitura
  --------------------- --------- ---------------------
  Negação                 `¬p`    não p
  Conjunção              `p ∧ q`  p e q
  Disjunção              `p ∨ q`  p ou q
  Disjunção exclusiva    `p ⊕ q`  ou p ou q
  Condicional            `p → q`  se p, então q
  Bicondicional          `p ↔ q`  p se e somente se q

------------------------------------------------------------------------

## Conjunção --- E

Representação:

**p ∧ q**

Exemplo:

> **p:** Ana estuda.\
> **q:** Ana trabalha.

Então:

> **p ∧ q:** Ana estuda **e** trabalha.

A conjunção só é verdadeira quando **as duas proposições são
verdadeiras**.

   p   q   p ∧ q
  --- --- -------
   V   V   **V**
   V   F     F
   F   V     F
   F   F     F

### BIZU

> 💡 No **E**, seja exigente: **todo mundo precisa ser V**.

------------------------------------------------------------------------

## Disjunção --- OU

Representação:

**p ∨ q**

Exemplo:

> Vou estudar **ou** vou revisar a lei.

Na disjunção inclusiva, basta pelo menos uma proposição ser verdadeira.

   p   q   p ∨ q
  --- --- -------
   V   V     V
   V   F     V
   F   V     V
   F   F   **F**

### BIZU

> 💡 O **OU** só é falso quando **tudo é falso**.

------------------------------------------------------------------------

## Condicional --- SE... ENTÃO

Representação:

**p → q**

Leitura:

> Se p, então q.

Exemplo:

> Se estudo, então passo na prova.

   p   q   p → q
  --- --- -------
   V   V     V
   V   F   **F**
   F   V     V
   F   F     V

### BIZU

> 🎯 A condicional só é falsa em **V → F**.

------------------------------------------------------------------------

## Bicondicional --- SE E SOMENTE SE

Representação:

**p ↔ q**

A bicondicional é verdadeira quando `p` e `q` possuem **o mesmo valor
lógico**.

   p   q   p ↔ q
  --- --- -------
   V   V   **V**
   V   F     F
   F   V     F
   F   F   **V**

### BIZU

> 💡 No **se e somente se**, valores **iguais dão V**.

------------------------------------------------------------------------

# 3. Negação Simples

Agora podemos estudar especificamente a **negação**.

Se temos uma proposição `p`, sua negação é representada por:

**¬p**

Lemos:

> **não p**

Negar uma proposição significa produzir outra proposição com **valor
lógico contrário**.

   p    ¬p
  --- -------
   V   **F**
   F   **V**

## Lousa --- Negação Simples

![Lousa sobre negação simples](/images/logica/negacao-simples.png)

## Exemplo 1

> **p:** Brasília é a capital do Brasil.

Sabemos que:

**p = V**

Negação:

> **¬p:** Brasília não é a capital do Brasil.

Portanto:

**¬p = F**

------------------------------------------------------------------------

## Exemplo 2

> **p:** O Brasil fica na Europa.

Temos:

**p = F**

Negação:

> **¬p:** O Brasil não fica na Europa.

Logo:

**¬p = V**

------------------------------------------------------------------------

## O assunto precisa permanecer

Considere:

> **p:** Maria é médica.

A negação correta é:

> **¬p:** Maria não é médica.

Não podemos escrever:

> ❌ Maria é advogada.

Essa é outra afirmação, mas não é a negação lógica da proposição
original.

### BIZU

> 💡 **Negue a informação, não invente outra.**
>
> A negação muda o valor lógico, mas mantém o assunto da proposição.

------------------------------------------------------------------------

## Dupla negação

Se:

> **p:** João estuda.

Então:

> **¬p:** João não estuda.

Negando novamente:

> **¬(¬p):** João estuda.

Portanto:

**¬¬p ≡ p**

### BIZU

> 🎯 Duas negações consecutivas se anulam.

------------------------------------------------------------------------

## Negação de igualdade e desigualdade

Esse ponto costuma gerar erros.

  Proposição   Negação
  ------------ ---------
  `x = 5`      `x ≠ 5`
  `x ≠ 5`      `x = 5`
  `x > 5`      `x ≤ 5`
  `x < 5`      `x ≥ 5`
  `x ≥ 5`      `x < 5`
  `x ≤ 5`      `x > 5`

Por exemplo:

> **p:** x \> 10

A negação não é apenas:

> ❌ x \< 10

O valor `x = 10` também torna `x > 10` falso.

Portanto:

> **¬p:** x ≤ 10

------------------------------------------------------------------------

# 4. Negação de Proposições Compostas

Quando uma proposição possui conectivos, não podemos simplesmente
colocar a palavra **"não"** na frente e encerrar a questão.

Precisamos identificar o **conectivo principal** e aplicar sua regra de
negação.

## Lousa --- Negação de Proposições Compostas

![Lousa sobre negação de proposições
compostas](/images/logica/negacao-composta.png)

------------------------------------------------------------------------

# Leis de De Morgan

As duas regras fundamentais são:

## Negação do E

**¬(p ∧ q) ≡ ¬p ∨ ¬q**

Ou seja:

> **E vira OU** e negamos cada proposição.

### Exemplo

Considere:

> João **estuda e trabalha**.

Definindo:

-   `p`: João estuda.
-   `q`: João trabalha.

Temos:

**p ∧ q**

Negando:

**¬(p ∧ q)**

Aplicando De Morgan:

**¬p ∨ ¬q**

Em português:

> João **não estuda ou não trabalha**.

### BIZU

> 🔄 Ao negar: **E → OU**.

------------------------------------------------------------------------

## Negação do OU

**¬(p ∨ q) ≡ ¬p ∧ ¬q**

Ou seja:

> **OU vira E** e negamos cada proposição.

### Exemplo

> Ana estuda **ou** trabalha.

Temos:

**p ∨ q**

Negação:

**¬(p ∨ q) ≡ ¬p ∧ ¬q**

Portanto:

> Ana **não estuda e não trabalha**.

### BIZU

> 🔄 Ao negar: **OU → E**.

------------------------------------------------------------------------

# Negação da Condicional

A condicional possui uma regra muito importante:

**¬(p → q) ≡ p ∧ ¬q**

Observe algo diferente:

-   mantemos `p`;
-   colocamos **E**;
-   negamos `q`.

### Exemplo

> Se estudo, então passo na prova.

Definindo:

-   `p`: estudo;
-   `q`: passo na prova.

Temos:

**p → q**

A negação é:

**p ∧ ¬q**

Portanto:

> **Estudo e não passo na prova.**

### BIZU

> 🎯 Para negar **SE p, ENTÃO q**:
>
> **MANTÉM p + E + NEGA q**

------------------------------------------------------------------------

# Negação da Bicondicional

Temos:

**¬(p ↔ q)**

Uma forma equivalente é:

**(p ∧ ¬q) ∨ (¬p ∧ q)**

Isso significa que a bicondicional é falsa quando as proposições possuem
**valores diferentes**.

### Exemplo

> João estuda se e somente se trabalha.

A negação representa os casos:

> João estuda e não trabalha

**OU**

> João não estuda e trabalha.

### BIZU

> 💡 Negar o **↔** significa dizer que os valores são **diferentes**.

------------------------------------------------------------------------

# Resumo das Negações

  Original   Negação equivalente
  ---------- -----------------------
  `p`        `¬p`
  `¬p`       `p`
  `p ∧ q`    `¬p ∨ ¬q`
  `p ∨ q`    `¬p ∧ ¬q`
  `p → q`    `p ∧ ¬q`
  `p ↔ q`    `(p ∧ ¬q) ∨ (¬p ∧ q)`

## BIZU GERAL

``` text
E   → vira → OU
OU  → vira → E

SE p, ENTÃO q
        ↓
p E NÃO q

p ↔ q
  ↓
valores diferentes
```

------------------------------------------------------------------------

# Exemplos de Concurso

## Questão 1

Negue:

> Pedro estuda e trabalha.

Pense antes de abrir a resposta.

```{=html}
<details>
```
```{=html}
<summary>
```
Ver resposta
```{=html}
</summary>
```
Temos:

`p ∧ q`

Pela Lei de De Morgan:

`¬(p ∧ q) ≡ ¬p ∨ ¬q`

Portanto:

**Pedro não estuda ou não trabalha.**

```{=html}
</details>
```

------------------------------------------------------------------------

## Questão 2

Negue:

> Ana estuda ou trabalha.

```{=html}
<details>
```
```{=html}
<summary>
```
Ver resposta
```{=html}
</summary>
```
Temos:

`p ∨ q`

Então:

`¬(p ∨ q) ≡ ¬p ∧ ¬q`

Resposta:

**Ana não estuda e não trabalha.**

```{=html}
</details>
```

------------------------------------------------------------------------

## Questão 3

Negue:

> Se Carlos estudar, então será aprovado.

```{=html}
<details>
```
```{=html}
<summary>
```
Ver resposta
```{=html}
</summary>
```
Temos:

`p → q`

A negação da condicional é:

`p ∧ ¬q`

Resposta:

**Carlos estuda e não é aprovado.**

Observe que não trocamos simplesmente "se" por "se não".

```{=html}
</details>
```

------------------------------------------------------------------------

## Questão 4

Negue:

> João é servidor e Maria é professora.

```{=html}
<details>
```
```{=html}
<summary>
```
Ver resposta
```{=html}
</summary>
```
Temos:

`p ∧ q`

Negando:

`¬p ∨ ¬q`

Resposta:

**João não é servidor ou Maria não é professora.**

```{=html}
</details>
```

------------------------------------------------------------------------

# Desafio Final

Considere:

> Se João estuda e Maria trabalha, então Pedro é aprovado.

Antes de tentar negar toda a frase de uma vez, identifique a estrutura.

Podemos escrever:

**(p ∧ q) → r**

A negação de uma condicional é:

**A ∧ ¬B**

Aqui:

-   `A = (p ∧ q)`
-   `B = r`

Portanto:

**¬\[(p ∧ q) → r\] ≡ (p ∧ q) ∧ ¬r**

Em português:

> **João estuda e Maria trabalha e Pedro não é aprovado.**

Esse tipo de decomposição é muito útil quando a banca apresenta
proposições maiores.

------------------------------------------------------------------------

# Mapa Mental

``` text
PROPOSIÇÕES LÓGICAS
│
├── PROPOSIÇÃO
│   ├── sentença declarativa
│   └── valor lógico → V ou F
│
├── CONECTIVOS
│   ├── ¬  NÃO
│   ├── ∧  E
│   ├── ∨  OU
│   ├── →  SE... ENTÃO
│   └── ↔  SE E SOMENTE SE
│
└── NEGAÇÃO
    │
    ├── SIMPLES
    │   ├── V ↔ F
    │   └── ¬¬p ≡ p
    │
    └── COMPOSTA
        ├── ¬(p ∧ q) ≡ ¬p ∨ ¬q
        ├── ¬(p ∨ q) ≡ ¬p ∧ ¬q
        ├── ¬(p → q) ≡ p ∧ ¬q
        └── ¬(p ↔ q)
            ≡ (p ∧ ¬q) ∨ (¬p ∧ q)
```

------------------------------------------------------------------------

## Para memorizar antes da prova

> 🧠 **1. Primeiro descubra o conectivo principal.**
>
> **2. Depois aplique a regra de negação.**
>
> **3. No E/OU, use De Morgan: troque o conectivo e negue as partes.**
>
> **4. Na condicional: mantém a primeira, coloca E e nega a segunda.**
>
> **5. Confira se sua nova frase realmente representa o contrário lógico
> da original.**
