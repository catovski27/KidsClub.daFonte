# 🌿 KidsClub.daFonte

> **"cuidar e educar | natureza e arte | brincar e crescer"**

🌐 **Website Oficial (GitHub Pages):** [https://catovski27.github.io/KidsClub.daFonte/](https://catovski27.github.io/KidsClub.daFonte/)  
📝 **Formulário de Inscrição Oficial (Google Forms):** [Preencher Formulário de Inscrição](https://docs.google.com/forms/d/11l4VuL1tLVeBoZVqpM1so1B5nwW7g1xuZIPPCdEGzOw/viewform?edit_requested=true)

O **KidsClub.daFonte** é um projeto lúdico-pedagógico e comunitário localizado na **Terra da Fonte** (Milharado, Mafra), desenvolvido sob a coordenação artística e pedagógica da **Amálgama Associação Cultural** para o ano letivo **2026 | 2027**.

O projeto destina-se a bebés e crianças das faixas etárias dos **6 meses aos 3 anos** e dos **3 aos 6 anos**, oferecendo uma resposta integrada de acolhimento, desenvolvimento consciente e conciliação familiar num ambiente rodeado pela natureza.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estrutura Single Page Application (SPA) contínua e acessível.
- **CSS3 / Tailwind CSS (via CDN):** Sistema de design com variáveis personalizadas de tons terra e pastel (`--verde-folha`, `--terracota`, `--amarelo-sol`, `--verde-suave`, `--creme-fundo`).
- **JavaScript (ES6+):** Lógica interativa sem dependências complexas (comutadores de horário, abas pedagógicas, galeria lightbox e simulador dinâmico de preços).
- **GSAP & ScrollTrigger:** Animações fluidas ao fazer scroll e efeito de folhas a flutuar.
- **Lucide Icons:** Ícones vetoriais orgânicos e modernos.
- **Google Fonts:** `Fredoka` e `Quicksand` para títulos lúdicos e `Plus Jakarta Sans` para o corpo de texto.

---

## 🗺️ Estrutura do Site & Conteúdos

1. **Quem Somos:** Identidade, génese do projeto KidsClub.daFonte na Terra da Fonte, ligação à Amálgama Associação Cultural e faixas etárias (**6 meses aos 3 anos** e **3 aos 6 anos**).
2. **Propósito e Missão:** Missão, vídeo da natureza e desenvolvimento do Ser através dos **6 Sentidos da Ecopedagogia** (Experimentar, Sentir, Interpretar, Socializar, Contemplar, Integrar) e friso contínuo de fotografias (*marquee*).
3. **Princípios e Valores:** Abordagem pedagógica integrativa (**Montessori**, **Waldorf** e **MEM**), juntamente com os **5 Pilares** e os **8 Valores Fundamentais**.
4. **Equipa:** Perfis da Equipa de Direção (Alexandra Battaglia, Margarida Battaglia, Tiago Rocha), Cuidadoras/Educadoras (Sílvia Cabral, Catarina Martins, Natália Kozhevnikova) e Ajudantes.
5. **Espaço:** Galeria interativa das instalações e adaptações de segurança (Cozinha exterior de lama, salas interiores/mesas baixas, 2 bancos corridos, proteção de escadas superior/inferior, recinto exterior e vedação da piscina/lago).
6. **Programa Diário:** Comutador de horários detalhados para o período da **Manhã (08:15 - 13:00)** e da **Tarde (13:00 - 18:00)** com cartões visuais pareados.
7. **Atividades:** Grelha com 15 experiências categorizadas com filtros (yoga infantil, oficinas criativas, passeios na floresta, horta, contos, ética ambiental, festas de aniversário, etc.).
8. **Preçário:** Tabela com as 2 modalidades oficiais de inscrição (**Dia Inteiro 350€/mês**, **Meio Dia 200€/mês** com 10% de desconto de irmão) e nota informativa sobre utilização pontual avulsa (50€/sessão).
9. **Dia Aberto:** Apresentação presencial com cronograma detalhado do evento de acolhimento (10h00 às 12h00), leitor de vídeo oficial e grelha de memórias fotográficas.
10. **Contactos:** Contactos oficiais da coordenação (telefone, e-mail oficial) e Google Maps interativo integrado.

---

## 🚀 Como Executar Localmente

Como o projeto é construído em HTML5, CSS3 e JavaScript puro, não necessita de etapas de compilação complexas:

### Opção 1: Abrir diretamente no Browser
Basta dar dois cliques ou abrir o ficheiro [`index.html`](index.html) em qualquer navegador moderno.

### Opção 2: Servidor Local (Recomendado)
Para uma melhor experiência com o carregamento de fontes e recursos:
```bash
# Utilizando npx serve
npx serve .

# Ou utilizando Python
python -m http.server 8080
```
Em seguida, aceda a `http://localhost:8080` ou `http://127.0.0.1:8080`.

---

### Opção 3: Partilhar / Ver em Dispositivos na Mesma Rede (Wi-Fi / LAN)
Para que outras pessoas na mesma rede Wi-Fi (em smartphones, tablets ou outros computadores) possam aceder e testar o website em tempo real:

1. **Iniciar o Servidor Local:**
   ```bash
   # Com Python (acessível por toda a rede)
   python -m http.server 8080

   # Ou com npx serve
   npx serve .
   ```

2. **Descobrir o teu Endereço IP Local:**
   * **Windows:** Abre o terminal (PowerShell ou CMD) e executa:
     ```powershell
     ipconfig
     ```
     Procura pela linha **Endereço IPv4** (exemplo: `192.168.1.75` ou `192.168.0.120`).
   * **macOS / Linux:** Abre o terminal e executa:
     ```bash
     ipconfig getifaddr en0   # macOS
     hostname -I              # Linux
     ```

3. **Aceder a partir de Qualquer Dispositivo:**
   No telemóvel ou tablet ligado à mesma rede Wi-Fi, abre o navegador (Chrome, Safari, etc.) e escreve:
   ```text
   http://<O-TEU-IP-LOCAL>:8080
   # Exemplo: http://192.168.1.75:8080
   ```

---

## 📁 Estrutura de Diretórios

```
KidsClub.daFonte/
├── index.html           # Página principal (Single Page Application)
├── README.md            # Documentação do repositório
├── LICENSE              # Licença do projeto
├── css/
│   └── main.css         # Tokens de design, fontes e estilos personalizados
├── js/
│   └── main.js          # Animações GSAP, comutadores e lógica do formulário
└── assets/
    ├── images/          # Fotografias oficiais (Logo, Equipa, Espaço, Open Day, Atividades)
    └── videos/          # Vídeos ilustrativos do espaço e das dinâmicas
```

---

## 📞 Contactos & Inscrições

- **Período de Inscrição Anual:** 1 de Julho a 15 de Agosto (Vagas Limitadas)
- **Telemóvel:** +351 918 080 412 (Margarida Battaglia)
- **E-mail:** `info.terradafonte@gmail.com`
- **Endereço:** Terra da Fonte — Caminho da Encosta 330, Vale de São Gião, Milharado, Mafra
