# Áudio, voz e legendas

O som é metade de como um filme é sentido, e o espectador nota um filme mudo antes de qualquer frame. Planeje de propósito. Você NÃO ouve o resultado: meça (`media-check.mjs`) e diga isso na entrega.

## 1. Padrão

- **Filme > ~15s que conta algo** (explainer, lançamento, resumo): trilha + efeitos nas ações visíveis, a menos que o usuário peça silêncio ou o vídeo seja para tocar mudo (feed autoplay, loop de fundo — aí tipo e imagem carregam tudo).
- **Narração** só quando o pedido ou a fonte pede. Em pt-BR por padrão.
- **Peças curtas** (vinheta < 10s, legendas sobre footage com som próprio): siga o pedido e o footage.
- Cada storyline declara seu som em uma linha: sensação + BPM da trilha, o ÚNICO momento em que a música muda, quais ações têm efeito.

## 2. O relógio

- **Narrado: a voz é o relógio.** Gere a narração ANTES de animar (`scripts/tts.mjs`) e cronometre cada beat pela palavra-âncora (o texto pousa na palavra que o diz). Nunca acelere uma leitura para caber num slot — mude o slot. Regerou a voz → re-cronometre.
  - Duração da cena = fala da cena + 0,3–0,8s de respiro; total = Σ cenas − Σ transições.
  - ~2,5 palavras/s é um ritmo natural de narração em pt-BR (≈150 ppm). Cena narrada ≈ até ~19 palavras.
- **Só música: a música é o relógio.** Payoff e marca nos tempos fortes; cortes no beat (`beatFrame()`), troca de layout no compasso. Entre na trilha no compasso mais forte (não na intro quieta); termine numa barra com fade curto sob o end card.
- Deixe o som atuar: o "jeito velho" quase em silêncio, a música abre quando o produto/ideia aparece; segure a música até o payoff.

## 3. TTS (narração)

| Provedor | Qualidade pt-BR | Custo | Tempos por palavra | Como |
|---|---|---|---|---|
| **ElevenLabs** (eleven_multilingual_v2 / v3) | excelente, emoção, clonagem | pago (créditos) | **exatos** (endpoint with-timestamps) | `ELEVENLABS_API_KEY`, `voice` = voice_id |
| **OpenAI** gpt-4o-mini-tts | muito boa, aceita `instructions` de tom | pago (barato) | estimados | `OPENAI_API_KEY`, vozes coral/sage/ash/nova… |
| **Edge TTS** (Microsoft neural) | boa; pt-BR-FranciscaNeural, pt-BR-AntonioNeural, pt-BR-ThalitaMultilingualNeural | grátis, sem chave | estimados | `pip install edge-tts` |
| **macOS say** (Luciana) | robótica — só rascunho/timing | grátis, offline | estimados | nativo no Mac |
| Kokoro-82M (local) | ok, vozes pt-BR limitadas | grátis, local | — | via Docker/Python, se o usuário quiser 100% local |

`node <skill>/scripts/tts.mjs voiceover.json` → `public/voiceover/<id>.mp3` + `src/voiceover.ts` (durações e palavras). Se o usuário não disse o provedor: recomende ElevenLabs (peça a chave) e ofereça Edge TTS como alternativa grátis. Rascunhe com voz grátis, finalize com a boa (a duração muda: re-cronometre).

Escrita para voz: frases curtas, números por extenso quando ajudam a leitura ("vinte e cinco por cento" vs "25%"), siglas soletradas, pausas com vírgula/reticências, pronúncia de nomes estrangeiros testada.

No componente:
```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { voById } from "../voiceover";
const vo = voById("hook");
<Audio src={staticFile(vo.file)} />   // dentro da Sequence da cena
```

## 4. Música

- A trilha do usuário primeiro. Senão, sugira fontes livres de royalties e peça o arquivo: YouTube Audio Library (só para vídeos publicados no YouTube; algumas faixas exigem crédito), Pixabay Music, Uppbeat (plano grátis exige crédito), Free Music Archive (licença varia por faixa — confira sempre), ou pagas (Artlist, Epidemic Sound, Musicbed). Busque pela SENSAÇÃO e tempo ("pulso minimalista tenso crescendo para um drop brilhante, 120 bpm"), não pelo assunto.
- Sem fonte de música disponível: entregue sem trilha e diga em uma linha como adicionar. Não gaste a sessão sintetizando música em código.
- Volume da música sob voz ≈ 0,12–0,18 (no Remotion `volume={0.14}`), com fade in/out por função do frame. Ducking simples: baixe para ~0,08 durante as falas.

## 5. Efeitos sonoros (SFX)

Poucos e exatos; todo efeito tem causa na tela.

| Som | Só em |
|---|---|
| clique | clique real de cursor |
| whoosh | corte de cena / card grande se movendo rápido |
| tique suave | texto chegando letra a letra |
| pop | badge, chip ou número pousando |
| riser → impacto | o payoff ou a marca, UMA vez no filme |

- Posicione o pico do som **1 frame depois** da imagem (luz chega antes do som; som adiantado parece errado mais rápido que atrasado).
- Cada hit 3–6 dB acima da trilha. Alterne 2–3 takes de um som repetido (o mesmo whoosh em todo corte é tell).
- Fontes: `https://remotion.media/whoosh.wav`, `whip.wav`, `switch.wav`, `mouse-click.wav`, `ding.wav`, `page-turn.wav`, `shutter-modern.wav` (catálogo oficial nas skills do Remotion; muitos outros são memes — evite em vídeo sério); repositório soundcn (github.com/kapishdima/soundcn); freesound.org (licença CC por som); Pixabay SFX. Para produção, baixe para `public/sfx/` (não dependa de URL remota no render).
- Sobre música forte, um filme cheio de digitação pode dispensar cliques e teclas.

## 6. Níveis e entrega

- Mix ≈ **-14 LUFS** (YouTube/social; -16 para podcast/voz), **true peak ≤ -1 dBTP**, nada clipando (áudio de IA costuma vir alto).
- Medir: `node <skill>/scripts/media-check.mjs out/video.mp4`; normalizar: `--normalize` (loudnorm, vídeo copiado).
- Graves concentrados < 150 Hz somem em alto-falante de celular — prefira trilhas com médios presentes.

## 7. Legendas

- Muitos assistem sem som: **fala precisa de legenda** em vídeo social.
- Formato JSON compatível com `@remotion/captions` (`{text,startMs,endMs}`); componente do kit: `<Captions>` (palavra a palavra, página de 3–4 palavras, palavra ativa em accent, contorno).
- **Gerar tempos:**
  1. ElevenLabs with-timestamps (via `tts.mjs`) — exato e grátis junto com a voz;
  2. Whisper local — Remotion `@remotion/whisper-webgpu` (`transcribe()` + `toCaptions()`; modelo multilíngue `small`/`medium` com `language: "pt"` — detecção automática não suportada; precisa de GPU compatível) — ver `/remotion-captions` nas skills oficiais para o código atual; alternativa: `whisper.cpp` / `openai-whisper` / `faster-whisper` em Python gerando JSON por palavra;
  3. OpenAI API de transcrição com `timestamp_granularities: ["word"]`;
  4. Importar `.srt` existente (`parseSrt` de `@remotion/captions`).
- Tempos são relativos ao início do ÁUDIO de origem: coloque legenda e áudio na mesma `<Sequence>`.
- Estilo: no máximo 2 linhas, ~5 palavras por linha (vertical), dentro da zona segura, nunca cobrindo rosto ou o herói. Revise ortografia — o Whisper erra nomes próprios.
- Também exporte `.srt` quando o usuário for subir o vídeo (plataformas indexam legenda fechada).
