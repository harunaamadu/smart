export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">Our company</p>
      <h1 className="mt-2 text-3xl font-semibold">About Anon</h1>
      <p className="mt-6 text-base leading-relaxed">
        Anon is a fashion house built for everyday dressing — clothes, footwear, jewelry, and the small things
        that finish a look. We buy like a specialty store: short runs, honest materials, and prices that still
        leave room for a second piece.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {[
          { t: "Worldwide delivery", d: "Free on orders over $100, tracked to the door." },
          { t: "Easy returns", d: "Send it back within 30 days if it isn't right." },
          { t: "Secure payment", d: "Cards, wallets, and encrypted checkout." },
          { t: "Desk hours", d: "Support 8AM–11PM for sizing, orders, and care." },
        ].map((item) => (
          <div key={item.t} className="rounded-md border border-border/90 p-5">
            <h2 className="font-semibold">{item.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
          </div>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-lg font-semibold">Legal notice & terms</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Products are sold by Anon. Prices are in USD unless you switch currency in the header. Title passes
          on delivery. Promotional timers are store-wide sale windows, not personalized offers. By placing an
          order you agree that we may contact you about that order only.
        </p>
      </section>
    </div>
  );
}
