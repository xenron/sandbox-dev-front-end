import marked from './marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/default.css';
import map from './emoji/map.json';
import './emoji/emoji.css';

var renderer = new marked.Renderer();
renderer.code = function (code, lang, escaped) {

    if (lang === 'mermaid' && mermaid.parse(code)) {
        return '<div class="mermaid">' + code + '</div>';
    }

    var out = highlight.highlightAuto(code).value;
    //var out = code + ' ';
    if (out != null && out !== code) {
        escaped = true;
        code = out;
    }

    if (!lang) {
        return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '\n</code></pre>';
    }

    return '<pre><code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '">'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>\n';
};
renderer.listitem = function (text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
        text = text
            .replace(/^\s*\[ \]\s*/, '<i class="fa fa-square-o"></i> ')
            .replace(/^\s*\[x\]\s*/, '<i class="fa fa-check-square"></i> ');
        return '<li style="list-style: none">' + text + '</li>';
    } else {
        return '<li>' + text + '</li>';
    }
};
renderer.image = function (href, title, text) {

    // place holder
    if (!href) {
        // TODO
    }

    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
};
marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    emoji: function (key) {
        var emoji = map[key];
        if (emoji) {
            return `<span class="emoji emoji${emoji}"></span>`;
        }
        else {
            return `:${key}:`;
        }
    }
});

export default function parser(markdown) {
    return marked(markdown);
};