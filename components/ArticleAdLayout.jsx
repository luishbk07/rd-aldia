import AdSlot from "./AdSlot";

export default function ArticleAdLayout({ intro, paragraphs, footer }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="lg:grid lg:grid-cols-[minmax(0,48rem)_18.75rem] lg:justify-center lg:gap-10">
        <article>
          {intro}
          <div className="mt-8 space-y-5 text-base leading-7 text-foreground">
            {paragraphs.map((paragraph, index) => (
              <div key={paragraph.slice(0, 24)}>
                <p>{paragraph}</p>
                {index === 1 ? (
                  <div className="flex justify-center py-4 lg:hidden">
                    <AdSlot size="rectangle" position="article-inline" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {footer}
        </article>
        <aside className="mt-10 hidden lg:block">
          <div className="sticky top-24">
            <AdSlot size="rectangle" position="article-sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
