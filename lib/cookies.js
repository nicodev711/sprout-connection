import cookie from 'cookie';

export function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export function setCookie(res, name, value, options = {}) {
    const stringValue =
        typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    if ('maxAge' in options) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.maxAge /= 1000;
    }

    res.setHeader('Set-Cookie', cookie.serialize(name, String(stringValue), options));
}

export function destroyCookie(res, name) {
    res.setHeader(
        'Set-Cookie',
        cookie.serialize(name, '', {
            maxAge: -1,
            path: '/',
        })
    );
}
