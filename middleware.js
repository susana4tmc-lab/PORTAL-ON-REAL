// Protecção por palavra-passe do Portal ON-RE@L.
// Os utilizadores ficam na variável de ambiente PORTAL_USERS do Vercel,
// no formato  utilizador:palavrapasse  separados por vírgulas.
// Exemplo com um só utilizador:   onreal:MinhaSenha2026
// Exemplo com vários:             susana:SenhaA,carla:SenhaB,joao:SenhaC

export const config = {
  matcher: '/(.*)', // protege todas as páginas e ficheiros do site
};

function pedirLogin() {
  return new Response('Acesso reservado à equipa ON-RE@L.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Portal ON-RE@L", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export default function middleware(request) {
  const lista = (process.env.PORTAL_USERS || '')
    .split(',')
    .map((par) => par.trim())
    .filter(Boolean);

  // Se a variável não estiver configurada, bloqueia tudo (nunca fica aberto por engano).
  if (lista.length === 0) {
    return new Response('Portal ainda não configurado.', { status: 503 });
  }

  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) return pedirLogin();

  let credenciais;
  try {
    credenciais = atob(auth.slice(6));
  } catch {
    return pedirLogin();
  }

  if (!lista.includes(credenciais)) return pedirLogin();

  // Credenciais certas: não devolve nada e a página abre normalmente.
}
