import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFab from "./components/WhatsAppFab.jsx";
import useReveal from "./hooks/useReveal.js";

export default function App() {
  useReveal();

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
