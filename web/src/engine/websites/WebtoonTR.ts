import { Tags } from '../Tags';
import icon from './WebtoonTR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('b').textContent.split(' - ')[1].trim()
    };
}

@Common.MangaCSS(/^{origin}\/_\/[^/]+$/, 'div.tanitim li.list-group-item blockquote.h3')
@Common.MangasSinglePagesCSS([ '/webtoon-listesi' ], 'ul.list-inline li a')
@Common.ChaptersSinglePageCSS('table.table tbody tr td a', ChapterExtractor)
@Common.PagesSinglePageCSS('img.cImg')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoontr', `WebtoonTR`, 'https://webtoontr.com', Tags.Language.Turkish, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}