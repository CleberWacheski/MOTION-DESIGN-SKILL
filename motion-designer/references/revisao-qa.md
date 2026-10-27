# Revisão — ver o filme como o espectador vê

Você escreveu a timeline, então sabe o que acontece; o espectador vê UMA vez, em velocidade normal, muitas vezes no celular. A revisão é ver como ele vê: como um diretor de motion exigente, não como um autor orgulhoso. Rode depois de cada filme novo e de qualquer edição que mexa em tempo ou layout, antes de responder ou renderizar.

## 1. Medir, depois olhar

1. **Compila?** `npx tsc --noEmit` (ou `npm run lint`).
2. **Contact sheet geral:** `node <skill>/scripts/snapshot.mjs Main` → abra `_contact-sheet.png` com Read. (≈12 amostras espalhadas.)
3. **Costuras:** `snapshot.mjs Main --seams 3.2,7.6,11` (−0,2s, corte, +0,2s de cada transição) — pega saltos, cenas assentando antes do corte, sobreposições estranhas.
4. **Momentos-chave:** `--at 0,<payoff>,<fim>` — frame 0 (thumbnail), o payoff, o end card.
5. **Celular:** gere a sheet da composição vertical ou reduza mentalmente a 360px de largura: dá para ler tudo?
6. **Arquivo final:** `media-check.mjs out/video.mp4 --expect-seconds N` — duração, pix_fmt, som presente, loudness.

Confie nos números onde discordam do olho: uma legenda cortada ou uma linha de 0,6s parece ok numa contact sheet.

## 2. O que procurar

Primeiro descreva cada frame-chave em uma frase como um estranho faria, nomeando todo objeto; um objeto que você precisaria explicar ("aquelas barras são espelhos") é P0. Depois leia os frames em ordem: contam uma história que um estranho segue, cada um causando o próximo? Compare com o SHOTS do SPEC.

| Pergunta | Pega |
|---|---|
| Lê como o que é? | forma que parece outra coisa, material que parece plástico, UI que parece mockup |
| O sujeito se separa do fundo? | valores próximos demais, dois focos no mesmo quadro, olho sem destino |
| Enquadramento e contato | cortes, texto na borda ou sob UI da plataforma, colisões, coisas flutuando que deveriam tocar |
| Tempo de 1ª vista | leitura mais curta que as palavras (0,5s+0,3s/palavra), algo que "pisca" sem movimento, salto no corte, tudo na mesma curva |
| Tells | itens de `direcao-criativa.md` §8 e `principios-motion.md` §9 na tela |
| Só as imagens | cobrindo as palavras, os frames ainda contam a história? |
| Frame 0 | thumbnail com gancho? nunca vazio/preto/só logo |
| Trechos mortos | > 3s sem nada mudando (sem ser hold intencional) |
| Texto | ≥ 28px a 1080; ortografia (pt-BR, acentos!); números batendo entre cenas; fonte na tela |
| Som | presente? hits onde a imagem bate? loudness no alvo? (medido, não ouvido) |

## 3. Notas e correções

Cada problema em uma linha: `t=4.2s · onde · problema → mudança exata · o que fica`. Classifique:
- **P0** quebra a leitura ou o contrato: ilegível, errado, quebrado, tell no plano-herói, frame 0 vazio, fato sem fonte.
- **P1** enfraquece: trecho morto, payoff fraco, costura que salta, ritmo monótono.
- **P2** polimento.

Corrija todo P0 e os P1 que valem o tempo: texto primeiro, depois tempo, depois detalhe. Depois tire snapshot SÓ do que mudou. Segunda passada só se um P0 continuar aberto. Nunca dê nota de 0 a 10 ao filme (nota não acha nada para consertar). Filme que parece poluído: remova 1/3 do movimento.

Para trabalho de alto risco (cliente, lançamento), peça uma revisão independente: um subagente recebe SÓ o SPEC.md e as contact sheets (não o código), e devolve linhas P0/P1 no formato acima.

## 4. Nota de entrega (REVIEW.md)

Escreva `REVIEW.md` na raiz do projeto e coloque a versão curta na resposta:
- as escolhas criativas feitas e as storylines não construídas;
- o que foi medido e o que só foi olhado; o que ninguém checou (o som foi medido, não ouvido);
- o plano mais fraco e o que mudaria com mais tempo;
- avisos mantidos de propósito e por quê;
- como editar (onde fica o texto: `src/data.ts`; o tema: `src/kit/theme.ts`; como renderizar).

Atualize também o `PROJECT.md` (fase, decisões, lições). A próxima sessão lê os dois antes de mudar qualquer coisa.

## Checklist rápido antes de entregar

- [ ] Frame 0 tem conteúdo (thumbnail)
- [ ] Toda linha legível no tempo (0,5s + 0,3s/palavra) e no tamanho (≥ 28px @1080)
- [ ] Nada fora da zona segura; nada sob a UI da plataforma (vertical)
- [ ] Um movimento-herói por plano; títulos parados depois de pousar
- [ ] 2–4 tipos de transição, cada uma com causa, na corrente
- [ ] Nenhum tell da lista BANNED
- [ ] Números reais com fonte; exemplos marcados "ilustrativo"
- [ ] Ortografia pt-BR revisada (acentos, crase)
- [ ] Som: presente, -14 LUFS, TP ≤ -1 (ou silêncio intencional declarado)
- [ ] Render: duração esperada, yuv420p, arquivo abre
- [ ] REVIEW.md e PROJECT.md atualizados
