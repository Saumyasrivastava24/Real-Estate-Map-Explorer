"use client";


export default function ContactUs() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-3xl mx-auto mt-16 p-8 border border-neutral-700 rounded-lg shadow-sm shadow-slate-200">
        <h1 className="text-4xl font-bold text-center mb-2">Contact Us</h1>
        <div className="w-full h-0.5 bg-blue-600 mx-auto mb-6"></div>

        <p className="text-neutral-200 text-lg leading-relaxed mb-6">
          We value your feedback and inquiries. If you have any questions or
          would like to learn more about our platform, feel free to reach out.
          Please fill out the form below, and we’ll get back to you as soon as
          possible.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-1 text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name..."
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email..."
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number..."
              required
            />
          </div>

          <div>
            <label htmlFor="datetime" className="block mb-1 text-gray-300">
              Preferred Date &amp; Time
            </label>
            <input
              type="datetime-local"
              id="datetime"
              className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold w-full"
          >
            Submit
          </button>
        </form>

        {/* Email Info */}
        <p className="text-neutral-200 text-lg mt-8 leading-relaxed">
          Alternatively, you can email us at:{" "}
          <a
            href="mailto:sparsh.lohana@gmail.com"
            className="text-blue-400 hover:underline"
          >
            sparsh.lohana@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
