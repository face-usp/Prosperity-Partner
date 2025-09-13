import About from "@/components/About";
import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import Review from "@/components/Review";
import Service from "@/components/Service";
export default function Page() {
  return (
     <div>
      <Navbar />
      <div id="home">
        <Home />
      </div>
      <div id="services">
        <Service />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="reviews">
        <Review />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </div>
  )
}