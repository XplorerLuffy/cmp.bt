export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-night">Our Story</h1>
      <div className="flex flex-col gap-4 text-brand-night/80">
        <p>
          Crystal Moon Products began in a small kitchen in Bhutan, where our founder
          started making achaar using a family recipe passed down for generations. What
          started as jars shared with neighbors and friends has grown into Crystal Moon
          Products — a small business dedicated to bringing authentic, handmade Bhutanese
          pickles to households across the country.
        </p>
        <p>
          Every jar is made in small batches, using fresh chilies, vegetables, and spices
          sourced from local Bhutanese farmers. We don&apos;t use shortcuts or
          mass-production — just time, care, and the same traditional methods used at home.
        </p>
        <h2 className="mt-4 text-xl font-semibold text-brand-night">What Makes Our Pickles Special</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Made by hand in small batches, never mass-produced</li>
          <li>Fresh, locally sourced Bhutanese ingredients</li>
          <li>Traditional family recipes with no artificial preservatives</li>
          <li>A range of flavors — from fiery ezay to tangy seasonal achaar</li>
        </ul>
        <p>
          We&apos;re proud to be a Bhutanese business serving Bhutanese households, one
          jar at a time. Thank you for supporting local.
        </p>
      </div>
    </div>
  );
}
