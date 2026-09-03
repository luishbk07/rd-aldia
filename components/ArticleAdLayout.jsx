import AdSlot from "./AdSlot";
import PortableContent from "./PortableContent";

export default function ArticleAdLayout({
  intro,
  paragraphs,
  content,
  footer,
}) {
  const portable = Array.isArray(content) && content.length > 0;
  const before = portable ? content.slice(0, 2) : [];
  const after = portable ? content.slice(2) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="lg:grid lg:grid-cols-[minmax(0,48rem)_18.75rem] lg:justify-center lg:gap-10">
        <article>
          {intro}
          <div className="mt-8 space-y-5 text-base leading-7 text-foreground">
            {portable ? (
              <>
                <PortableContent value={before} />
                {after.length ? (
                  <div className="flex justify-center py-4 lg:hidden">
                    <AdSlot
                      size="in-article"
                      position="article-inline"
                      format="fluid"
                      layout="in-article"
                    />
                  </div>
                ) : null}
                <PortableContent value={after} />
              </>
            ) : (
              (paragraphs || []).map((paragraph, index) => (
                <div key={paragraph.slice(0, 24)}>
                  <p>{paragraph}</p>
                  {index === 1 ? (
                    <div className="flex justify-center py-4 lg:hidden">
                      <AdSlot
                        size="in-article"
                        position="article-inline"
                        format="fluid"
                        layout="in-article"
                      />
                    </div>
                  ) : null}
                </div>
              ))
            )}
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
