export default function ContactSection() {
  return (
    <section className="basic_section">
      <div className="basic_content">
        <div>
          <h2>Contact</h2>

          <p className="indented">
            Have questions, ideas, or collaboration requests? Fill out the form
            below and we’ll get back to you as soon as possible.
          </p>

          <form
            className="contact_form"
            action="https://formspree.io/f/YOUR_FORM_ID"
            method="POST"
          >
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here"
              required
            />

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}