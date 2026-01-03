import { next } from '@vercel/edge';

export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === '/') {
    const acceptLang = request.headers.get('accept-language');
    if (acceptLang?.includes('en')) {
      return Response.redirect(new URL('/en/', request.url));
    }

    return Response.redirect(new URL('/es/', request.url));
  }

  return next();
}
