const postFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  featured,
  "author": author->name,
  coverImage,
  featuredImage,
  "coverImageUrl": coalesce(coverImage.asset->url, featuredImage.asset->url),
  content
`;

export const postsByCategoryQuery = `*[
  _type in ["post", "article"] &&
  defined(slug.current) &&
  (
    category == $category ||
    lower(string(category)) == lower($category) ||
    lower(category->slug.current) == lower($category) ||
    lower(category->title) == lower($category)
  )
] | order(publishedAt desc) {
  ${postFields}
}`;

export const postBySlugQuery = `*[_type in ["post", "article"] && slug.current == $slug][0] {
  ${postFields}
}`;

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, category }`;

export const featuredPostsQuery = `*[_type in ["post", "article"] && featured == true && defined(slug.current)] | order(publishedAt desc)[0...4] {
  ${postFields}
}`;

const destinationFields = `
  _id,
  name,
  "slug": slug.current,
  region,
  description,
  image,
  bestTimeToVisit,
  category,
  featured,
  body
`;

export const destinationsQuery = `*[_type == "destination" && defined(slug.current)] | order(name asc) {
  ${destinationFields}
}`;

export const destinationBySlugQuery = `*[_type == "destination" && slug.current == $slug][0] {
  ${destinationFields}
}`;

export const destinationSlugsQuery = `*[_type == "destination" && defined(slug.current)]{ "slug": slug.current }`;

export const featuredDestinationsQuery = `*[_type == "destination" && featured == true && defined(slug.current)] | order(name asc)[0...4] {
  ${destinationFields}
}`;
