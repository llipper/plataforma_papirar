# Proposições Lógicas: Negação

> **Objetivo:** entender o que é a negação de uma proposição, como ela
> altera o valor lógico e como identificar isso rapidamente em questões
> de concurso.

------------------------------------------------------------------------

## 1. Antes de tudo: o que é uma proposição?

Uma **proposição** é uma sentença declarativa que pode ser classificada
como **verdadeira (V)** ou **falsa (F)**.

**Exemplos:**

-   `Brasília é a capital do Brasil.` → **V**
-   `O Brasil fica na Europa.` → **F**
-   `2 + 2 = 4.` → **V**

Uma pergunta como **"Você estudou hoje?"** não é uma proposição, pois
não possui, por si só, um valor lógico V ou F.

------------------------------------------------------------------------

## 2. O que é a negação?

A **negação** de uma proposição é outra proposição que possui o **valor
lógico oposto** ao da proposição original.

Se chamarmos uma proposição de `p`, sua negação pode ser representada
por:

**¬p**

Lemos:

> **"não p"**

### Regra fundamental

  p   ¬p
  --- ----
  V   F
  F   V

Ou seja:

**V → F**\
**F → V**

> 💡 **BIZU:** a negação **inverte o valor lógico**, mas continua
> falando do mesmo assunto.

------------------------------------------------------------------------

## 3. Veja isso na lousa

A imagem abaixo resume visualmente a ideia de negação, o símbolo, a
tabela-verdade e os principais exemplos.

![Lousa --- Proposições Lógicas:
Negação](../imagens/proposicoes-logicas-negacao.png)

> **BIZU DA LOUSA:** pense na negação como um **interruptor lógico**. Se
> `p` está em V, `¬p` vai para F. Se `p` está em F, `¬p` vai para V.

------------------------------------------------------------------------

## 4. Exemplo simples

Considere:

**p:** Brasília é a capital do Brasil.

Essa proposição é **verdadeira**.

Sua negação é:

**¬p:** Brasília **não é** a capital do Brasil.

Como `p` é verdadeira, `¬p` é falsa.

``` text
p   = V
¬p  = F
```

### Agora ao contrário

Considere:

**p:** O Brasil fica na Europa.

Essa proposição é **falsa**.

Negando:

**¬p:** O Brasil **não fica** na Europa.

Agora a proposição é verdadeira.

``` text
p   = F
¬p  = V
```

------------------------------------------------------------------------

## 5. Negar não significa trocar toda a frase

Este é um ponto importante em prova.

Considere:

**p:** Maria é médica.

A negação correta é:

**¬p:** Maria **não é médica**.

Não seria:

❌ Maria é professora.\
❌ Maria é advogada.\
❌ João não é médico.

Essas frases podem até ter algum valor lógico, mas **não são a negação
de `p`**.

> 💡 **BIZU:** mantenha o **mesmo assunto** e negue aquilo que está
> sendo afirmado.

------------------------------------------------------------------------

## 6. E quando a frase já possui "não"?

Também podemos negar uma proposição negativa.

Considere:

**p:** João **não estuda**.

Sua negação é:

**¬p:** João **estuda**.

Em linguagem lógica, negar uma negação nos leva de volta à proposição
original:

**¬(¬p) ≡ p**

Isso é chamado de **dupla negação**.

### Exemplo

``` text
p      = Ana trabalha.
¬p     = Ana não trabalha.
¬(¬p)  = Ana trabalha.
```

> 🎯 **BIZU DE PROVA:** apareceu `¬¬p`? As duas negações se anulam:
> **¬¬p ≡ p**.

------------------------------------------------------------------------

## 7. Exemplos rápidos

### Exemplo 1

**p:** Pedro passou no concurso.\
**¬p:** Pedro **não passou** no concurso.

### Exemplo 2

**p:** 10 é maior que 5.\
**¬p:** 10 **não é maior que** 5.

### Exemplo 3

**p:** O candidato entregou o documento.\
**¬p:** O candidato **não entregou** o documento.

### Exemplo 4

**p:** A prova não foi anulada.\
**¬p:** A prova **foi anulada**.

------------------------------------------------------------------------

## 8. Cuidado com desigualdades

Em questões de raciocínio lógico e matemática, a negação precisa incluir
**todos os casos que tornam a afirmação falsa**.

Se:

**p:** `x > 10`

então:

**¬p:** `x ≤ 10`

Não é apenas `x < 10`, porque `x = 10` também torna `x > 10` falso.

Da mesma forma:

  Proposição   Negação
  ------------ ---------
  `x > a`      `x ≤ a`
  `x < a`      `x ≥ a`
  `x ≥ a`      `x < a`
  `x ≤ a`      `x > a`
  `x = a`      `x ≠ a`
  `x ≠ a`      `x = a`

> 💡 **BIZU:** ao negar `>` ou `<`, pense em **trocar o sentido e
> incluir a igualdade**.

------------------------------------------------------------------------

## 9. Teste rápido

Tente responder antes de abrir a solução.

### Questão 1

Considere:

**p:** "Carlos é servidor público."

Qual é a negação?

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
**Resposta:** Carlos **não é servidor público**.

A negação mantém Carlos e a propriedade analisada, alterando a afirmação
para sua negação.

```{=html}
</details>
```

------------------------------------------------------------------------

### Questão 2

Considere:

**p:** "A Constituição não possui emendas."

Qual é a negação?

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
**Resposta:** A Constituição **possui emendas**.

A frase original já contém uma negação. Ao negá-la, obtemos a
correspondente afirmação.

```{=html}
</details>
```

------------------------------------------------------------------------

### Questão 3

Considere:

**p:** `x ≥ 20`

Qual é a negação?

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
**Resposta:** `x < 20`.

Para `x ≥ 20` ser falso, `x` precisa ser menor que 20.

```{=html}
</details>
```

------------------------------------------------------------------------

### Questão 4

Se `p` é falsa, qual é o valor lógico de `¬p`?

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
**Resposta:** **Verdadeiro (V)**.

A negação sempre possui o valor lógico oposto ao de `p`.

```{=html}
</details>
```

------------------------------------------------------------------------

## 10. Resumo para memorizar

``` text
NEGAÇÃO
   │
   ├── Símbolo: ¬
   │
   ├── Leitura: "não"
   │
   ├── p = V  →  ¬p = F
   │
   ├── p = F  →  ¬p = V
   │
   └── ¬¬p ≡ p
```

### BIZU FINAL

> **Negar é fazer a proposição assumir exatamente o valor lógico
> contrário.**
>
> **V vira F. F vira V.**
>
> E atenção: em expressões como `>`, `<`, `≥` e `≤`, não basta
> simplesmente colocar a palavra **"não"** --- é preciso escrever
> corretamente o conjunto complementar.

------------------------------------------------------------------------

## Próximo passo

Depois de dominar a negação de uma proposição simples, o próximo nível é
aprender a negar **proposições compostas**, especialmente:

-   `p ∧ q` --- conjunção
-   `p ∨ q` --- disjunção
-   `p → q` --- condicional
-   quantificadores como **"todo"**, **"algum"** e **"nenhum"**

Essas formas aparecem com frequência em questões de raciocínio lógico.
