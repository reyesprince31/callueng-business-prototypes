from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import re

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.links, self.headings, self.routes = path, [], [], 0, []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if self.path == 'backoffice.html' and 'data-view' in attrs: self.routes.append(attrs['data-view'])
        if tag == 'h1': self.headings += 1
        if tag == 'img': assert 'alt' in attrs, f'{self.path}: image needs alt'
        for key in ['href', 'src']:
            if key in attrs: self.links.append(attrs[key])

pages = {}
for path in ROOT.glob('*.html'):
    page = Page(path.name)
    content = path.read_text(encoding='utf-8')
    assert 'Â' not in content and 'â€' not in content, f'{path.name}: encoding issue'
    assert '<meta name="robots" content="noindex,nofollow">' in content
    page.feed(content)
    assert page.headings == 1, f'{path.name}: expected one h1'
    assert not [key for key,count in Counter(page.ids).items() if count > 1], f'{path.name}: duplicate IDs'
    pages[path.name] = page
assert len(pages) == 14
for name in pages:
    html=(ROOT/name).read_text(encoding='utf-8')
    assert 'https://ayosgawa.com/' in html and 'https://princereyes.com/' in html, f'{name}: missing presentation credit'
for name,entity in [('blueprinting.html','printing'),('site-support.html','hardware')]:
    html=(ROOT/name).read_text(encoding='utf-8')
    assert f'data-entity="{entity}"' in html
    assert 'assistant-launch' not in html
    assert 'Plan my build' not in html
    assert 'entity.js?v=intake-2' in html
assert 'Blueprint printing / plan copies</option>' not in (ROOT/'plan.html').read_text(encoding='utf-8')
checked = 0
for name,page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc: continue
        target = unquote(url.path) or name
        assert (ROOT / target).is_file(), f'{name}: missing {target}'
        if url.fragment and target.endswith('.html'):
            assert url.fragment in pages[target].ids + pages[target].routes, f'{name}: missing fragment or app route {link}'
        checked += 1
for name in ['site.css','fonts.css','studio.css','entity.css','backoffice.css','backoffice-inbox.css']:
    for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)', (ROOT/name).read_text(encoding='utf-8')):
        assert (ROOT/urlsplit(url).path).is_file(), f'{name}: missing asset {url}'
assert (ROOT/'site.js').read_text(encoding='utf-8').count("$('button[data-theme]')") == 1
css = (ROOT/'site.css').read_text(encoding='utf-8')
def luminance(colour):
    channels = [int(colour[i:i+2],16)/255 for i in (1,3,5)]
    channels = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in channels]
    return sum(v*weight for v,weight in zip(channels,[.2126,.7152,.0722]))
def contrast(a,b):
    first,second = sorted([luminance(a),luminance(b)])
    return (second+.05)/(first+.05)
tokens = {}
for mode,pattern in [('light',r':root\{([^}]+)\}'),('dark',r':root\[data-theme=dark\]\{([^}]+)\}')]:
    values = {}
    for block in re.findall(pattern,css): values.update(dict(re.findall(r'--([\w-]+):(#[0-9a-f]{6})',block)))
    tokens[mode] = values
    for foreground in ['ink','muted']:
        for background in ['bg','surface','soft']: assert contrast(values[foreground],values[background]) >= 4.5
    assert contrast(values['control-line'],values['surface']) >= 3
assert contrast(tokens['light']['accent-ink'],tokens['light']['yellow']) >= 4.5
print(f'PASS: fourteen pages, {checked} local links/assets, fragments, image alternatives, unique IDs, UTF-8, presentation credits, and prototype indexing controls.')
print('PASS: light/dark text tokens meet 4.5:1; input borders meet 3:1 against their surface.')
