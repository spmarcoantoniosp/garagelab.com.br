/* ============================================================
   Garage — validação do formulário das páginas de isca.
   Melhoria progressiva: sem JS, o navegador ainda barra campo
   vazio e e-mail malformado pelo required e pelo type.
   Um arquivo para todas as iscas. Não depende de site.js.
   ============================================================ */
(function () {
  var form = document.querySelector('form.captura');
  if (!form) return;

  // A partir daqui as mensagens são nossas, não as do navegador.
  form.noValidate = true;

  var DDD = new Set([
    11,12,13,14,15,16,17,18,19, 21,22,24, 27,28,
    31,32,33,34,35,37,38, 41,42,43,44,45,46, 47,48,49,
    51,53,54,55, 61, 62,64, 63, 65,66, 67, 68, 69,
    71,73,74,75,77, 79, 81,87, 82, 83, 84, 85,88, 86,89,
    91,93,94, 92,97, 95, 96, 98,99
  ]);

  var DOMINIOS = [
    'gmail.com','hotmail.com','outlook.com','live.com','icloud.com','me.com',
    'yahoo.com','yahoo.com.br','uol.com.br','bol.com.br','terra.com.br',
    'globo.com','globomail.com','ig.com.br','protonmail.com'
  ];

  function distancia(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 99;
    var linha = Array.from({ length: b.length + 1 }, function (_, i) { return i; });
    for (var i = 1; i <= a.length; i++) {
      var anterior = linha[0];
      linha[0] = i;
      for (var j = 1; j <= b.length; j++) {
        var guardado = linha[j];
        linha[j] = a[i - 1] === b[j - 1]
          ? anterior
          : 1 + Math.min(anterior, linha[j], linha[j - 1]);
        anterior = guardado;
      }
    }
    return linha[b.length];
  }

  function dominioParecido(email) {
    var partes = email.split('@');
    if (partes.length !== 2) return null;
    var dominio = partes[1].toLowerCase();
    if (DOMINIOS.indexOf(dominio) !== -1) return null;
    var melhor = null, menor = 3;
    DOMINIOS.forEach(function (d) {
      var dist = distancia(dominio, d);
      if (dist < menor) { menor = dist; melhor = d; }
    });
    return melhor ? partes[0] + '@' + melhor : null;
  }

  function digitos(valor) { return (valor || '').replace(/\D/g, ''); }

  function mascara(valor) {
    var d = digitos(valor).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var REGRAS = {
    NOME: function (v) {
      if (!v.trim()) return 'Preencha seu nome.';
      if (v.trim().length < 2) return 'Nome muito curto.';
      if (/\d/.test(v)) return 'Nome não leva número.';
      return null;
    },
    SOBRENOME: function (v) {
      if (!v.trim()) return 'Preencha seu sobrenome.';
      if (v.trim().length < 2) return 'Sobrenome muito curto.';
      if (/\d/.test(v)) return 'Sobrenome não leva número.';
      return null;
    },
    EMAIL: function (v) {
      var valor = v.trim();
      if (!valor) return 'Preencha seu e-mail.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return 'Este e-mail não parece completo.';
      return null;
    },
    WHATSAPP: function (v) {
      var d = digitos(v);
      if (!d) return 'Preencha seu WhatsApp.';
      if (d.length < 11) return 'Faltam dígitos. São 11, com o DDD.';
      if (d.length > 11) return 'Dígitos demais. São 11, com o DDD.';
      if (!DDD.has(Number(d.slice(0, 2)))) return 'Este DDD não existe.';
      if (d[2] !== '9') return 'Celular começa com 9 depois do DDD.';
      return null;
    }
  };

  function caixaDoCampo(campo) { return campo.closest('.campo') || campo.parentNode; }

  function mostrarErro(campo, mensagem) {
    var caixa = caixaDoCampo(campo);
    var alvo = caixa.querySelector('.msg-erro');
    if (!alvo) {
      alvo = document.createElement('p');
      alvo.className = 'msg-erro';
      alvo.id = campo.id + '-erro';
      alvo.setAttribute('role', 'alert');
      caixa.appendChild(alvo);
    }
    alvo.textContent = mensagem;
    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', alvo.id);
    caixa.classList.add('com-erro');
  }

  function limparErro(campo) {
    var caixa = caixaDoCampo(campo);
    var alvo = caixa.querySelector('.msg-erro');
    if (alvo) alvo.remove();
    var sug = caixa.querySelector('.msg-sugestao');
    if (sug) sug.remove();
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    caixa.classList.remove('com-erro');
  }

  function sugerirDominio(campo) {
    var caixa = caixaDoCampo(campo);
    var existente = caixa.querySelector('.msg-sugestao');
    if (existente) existente.remove();
    var sugestao = dominioParecido(campo.value.trim());
    if (!sugestao) return;

    var p = document.createElement('p');
    p.className = 'msg-sugestao';
    p.appendChild(document.createTextNode('Você quis dizer '));
    var botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = sugestao;

    function aplicar(evento) {
      // No mousedown o botão ainda está onde a pessoa mirou. Se esperarmos
      // o click, o blur do campo anterior pode inserir uma mensagem de erro,
      // empurrar o layout e fazer o clique cair ao lado.
      if (evento) evento.preventDefault();
      campo.value = sugestao;
      p.remove();
      limparErro(campo);
      campo.focus();
    }
    botao.addEventListener('mousedown', aplicar);
    botao.addEventListener('click', aplicar);
    p.appendChild(botao);
    p.appendChild(document.createTextNode('?'));
    caixa.appendChild(p);
  }

  function validar(campo) {
    var regra = REGRAS[campo.name];
    if (!regra) return true;
    var erro = regra(campo.value);
    if (erro) { mostrarErro(campo, erro); return false; }
    limparErro(campo);
    if (campo.name === 'EMAIL') sugerirDominio(campo);
    return true;
  }

  var campos = Array.prototype.slice.call(form.querySelectorAll('.campo input'));

  campos.forEach(function (campo) {
    if (campo.name === 'WHATSAPP') {
      campo.setAttribute('inputmode', 'numeric');
      campo.setAttribute('maxlength', '16');
      campo.addEventListener('input', function () { campo.value = mascara(campo.value); });
    }
    // Só reclama depois que a pessoa sai do campo. Marcar em vermelho
    // no meio da digitação é hostil: ela ainda não terminou.
    campo.addEventListener('blur', function () { validar(campo); });
    campo.addEventListener('input', function () {
      if (caixaDoCampo(campo).classList.contains('com-erro')) validar(campo);
    });
  });

  // Origem: ?de=li na URL divulgada vira "LinkedIn" na ficha do contato.
  // O campo só existe se o título declarar formulario.campo_origem no JSON.
  var origem = form.querySelector('#c-origem');
  if (origem) {
    var CANAIS = {
      li: 'LinkedIn', 'li-post': 'LinkedIn post', 'li-bio': 'LinkedIn perfil',
      ig: 'Instagram', 'ig-bio': 'Instagram bio', 'ig-story': 'Instagram story',
      wa: 'WhatsApp', nl: 'Newsletter', yt: 'YouTube', qr: 'QR code'
    };
    var de = '';
    try {
      de = new URLSearchParams(window.location.search).get('de') || '';
    } catch (e) { de = ''; }
    de = de.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
    if (de) origem.value = CANAIS[de] || de;
  }

  var consentimento = form.querySelector('.consent input[type=checkbox]');

  form.addEventListener('submit', function (evento) {
    var primeiroInvalido = null;
    campos.forEach(function (campo) {
      if (!validar(campo) && !primeiroInvalido) primeiroInvalido = campo;
    });

    if (consentimento && !consentimento.checked) {
      form.querySelector('.consent').classList.add('com-erro');
      if (!primeiroInvalido) primeiroInvalido = consentimento;
    }

    if (primeiroInvalido) {
      evento.preventDefault();
      primeiroInvalido.focus();
      primeiroInvalido.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    // O Brevo espera o telefone com código do país e só dígitos.
    var whats = form.querySelector('input[name=WHATSAPP]');
    if (whats) whats.value = '55' + digitos(whats.value);
  });

  if (consentimento) {
    consentimento.addEventListener('change', function () {
      if (consentimento.checked) form.querySelector('.consent').classList.remove('com-erro');
    });
  }
})();
